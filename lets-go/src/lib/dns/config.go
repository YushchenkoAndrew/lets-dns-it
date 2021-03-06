package dns

import (
	"context"
	"fmt"
	"lets-go/src/lib/cache"
	"strings"

	pb "lets-go/src/pb/cachepb"

	"github.com/spf13/viper"
)

func LoadConfig(path, name, ext string) error {
	viper.AddConfigPath(path)
	viper.SetConfigName(name)
	viper.SetConfigType(ext)

	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		logger.Errorf("Failed on reading dns config file: %v", err)
		return err
	}

	var config ConfigDNS
	if err := viper.Unmarshal(&config); err != nil {
		logger.Errorf("Failed on reading dns config file: %v", err)
		return err
	}

	// Form map
	res, err := cache.Client().Set(
		context.Background(),
		&pb.SetRequest{
			Key:   NAMESERVERS_KEY,
			Value: strings.Join(config.Nameservers, NAMESERVERS_SEP),
		})

	if err != nil || res.Status != pb.Status_OK {
		logger.Errorf("Cache error: %s %v", res.Message, err)
	}

	for _, cfg := range config.Zones {
		for i, record := range cfg.Records {
			r := record.parse(&cfg)

			if conv, ok := ConfigRecordToString[RRTypeToInt[record.Type]]; !ok || conv(r) == "" {
				logger.Errorf("Unsupported type: %s '%s'", record.Type, r.Name)
				continue
			}

			res, err = cache.Client().Set(
				context.Background(),
				&pb.SetRequest{
					Key:   fmt.Sprintf("%s:%s:%d:%d", ZONE_KEY, r.Name, RRTypeToInt[r.Type], i),
					Value: ConfigRecordToString[RRTypeToInt[record.Type]](r),
				})

			if err != nil || res.Status != pb.Status_OK {
				logger.Errorf("Cache error: %s %v", res.Message, err)
			}
		}
	}

	return nil
}

func trimHost(host string) string {
	return strings.TrimRight(host, ".") + "."
}
