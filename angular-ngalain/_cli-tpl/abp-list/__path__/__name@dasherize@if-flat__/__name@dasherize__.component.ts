import { Component, Injector, ViewChild<% if(!!viewEncapsulation) { %>, ViewEncapsulation<% }%><% if(changeDetection !== 'Default') { %>, ChangeDetectionStrategy<% }%> } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/component-base/paged-listing-component-base';
import { PagedResultDtoOf<%= capitalize(name) %>Dto, <%= capitalize(name) %>ServiceProxy, <%= capitalize(name) %>Dto } from '@shared/service-proxies/service-proxies';

class Paged<%= capitalize(name) %>RequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
  from: Moment | null;
  to: Moment | null;
}

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.component.html',<% if(!inlineStyle) { %><% } else { %>
  styleUrls: ['./<%= dasherize(name) %>.component.<%= styleext %>']<% } %><% if(!!viewEncapsulation) { %>,
  encapsulation: ViewEncapsulation.<%= viewEncapsulation %><% } if (changeDetection !== 'Default') { %>,
  changeDetection: ChangeDetectionStrategy.<%= changeDetection %><% } %>
})
export class <%= componentName %> extends PagedListingComponentBase<<%= capitalize(name) %>Dto> {
  items: any[] = [];
  filter: any;
  searchSchema: SFSchema = {
    properties: {
      keyword: {
        type: 'string',
        title: '关键字'
      },
      isActive: {
        type: 'string',
        title: '是否启用',
        enum: [
          { label: '全部', value: '' },
          { label: '是', value: 'true' },
          { label: '否', value: 'false' }
        ],
        default: '',
        ui: {
          widget: 'select'
        }
      },
      from: {
        title: this.l('CreationTime'),
        type: 'string',
        format: 'date-time',
        ui: { widget: 'date', end: 'to' }
      },
      to: {
        format: 'date-time',
        type: 'string'
      }
    }
  };
  
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '全名', index: 'fullName' }, // this.l('pages.setting.<%= name %>.list.fullName')
    { title: '名字', index: 'name' },
    { title: '用户名', index: 'userName' },
    { title: '创建时间', type: 'date', index: 'creationTime' },
    {
      title: this.l('Actions'),
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // reload is function name in st
        // { text: '编辑', type: 'static', component: <%= componentName %>EditComponent, click: 'reload' },  
      ]
    }
  ];

  constructor(
    _injector: Injector,
    // private _<%= name %>Service: <%= capitalize(name) %>ServiceProxy,
    private modal: ModalHelper) {
    super(_injector);
  }

  // ngOnInit() { }

  query(event: any) {
    this.st.reset(event);
    this.filter = event;
    this.getDataPage(1); // getDataPage 新建了一个requestDto并把页码赋进去了
  }

  add() {
    // this.modal
    //   .createStatic(<%= componentName %>EditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }
  protected list(
    request: Paged<%= capitalize(name) %>RequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {

    _.merge(request, this.filter);

    if (this.filter && this.filter.from) {
      request.from = moment(this.filter.from);
    }
    if (this.filter && this.filter.to) {
      request.to = moment(this.filter.to);
    }

    this._<%= name %>Service
      .getAll(request.keyword, request.isActive, request.from, request.to, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: PagedResultDtoOf<%= capitalize(name) %>Dto) => {
        this.items = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity:  <%= capitalize(name) %>Dto): void {
    throw new Error('Method not implemented.');
  }
}