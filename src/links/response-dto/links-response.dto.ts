import { AliasLinksResponseDto } from '../../alias/response-dto/alias-links-response.dto';
import { ResponseProperty } from '../../common/decorators/response-property';
import { CommonResponseDto } from '../../common/response-dto/common-response.dto';

// TODO:
export class LinksResponseDto extends CommonResponseDto {
  constructor(init?: Partial<LinksResponseDto>) {
    super();
    this.assign(init, this);
  }

  @ResponseProperty((e) => e.nanoid)
  id: string = '';

  @ResponseProperty()
  name: string = '';

  // @ResponseProperty((e) => e.value || e.secret?.value || '')
  // value: string = '';

  @ResponseProperty()
  favorite: boolean = false;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e))
  children: AliasLinksResponseDto = null;

  @ResponseProperty((e) => new AliasLinksResponseDto().build(e))
  parent: AliasLinksResponseDto = null;
}
