package dns

import (
	"net"

	"github.com/miekg/dns"
)

func aRecord(c *ConfigRecord) string {
	var ip = net.ParseIP(c.Value)
	if ip == nil {
		return ""
	}

	res := dns.A{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		A:   ip[12:16],
	}

	return res.String()
}

func nsRecord(c *ConfigRecord) string {
	res := dns.NS{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Ns:  c.Value,
	}

	return res.String()
}

func srvRecord(c *ConfigRecord) string {
	res := dns.SRV{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},

		Priority: c.Priority,
		Weight:   c.Weight,
		Port:     c.Port,
		Target:   c.Target,
	}

	return res.String()
}

func cnameRecord(c *ConfigRecord) string {
	res := dns.CNAME{
		Hdr:    dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Target: c.Target,
	}

	return res.String()
}

func ptrRecord(c *ConfigRecord) string {
	res := dns.PTR{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Ptr: c.Value,
	}

	return res.String()
}

func mxRecord(c *ConfigRecord) string {
	res := dns.MX{
		Hdr:        dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Preference: c.Priority,
		Mx:         c.Target,
	}

	return res.String()
}

func aaaaRecord(c *ConfigRecord) string {
	var ip = net.ParseIP(c.Value)
	if ip == nil {
		return ""
	}

	res := dns.AAAA{
		Hdr:  dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		AAAA: ip,
	}

	return res.String()
}

func txtRecord(c *ConfigRecord) string {
	res := dns.TXT{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Txt: []string{c.Value},
	}

	return res.String()
}

func caaRecord(c *ConfigRecord) string {
	res := dns.CAA{
		Hdr:   dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Flag:  c.Flag,
		Tag:   c.Tag,
		Value: c.Value,
	}

	return res.String()
}
