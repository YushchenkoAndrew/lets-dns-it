import { createSlice } from '@reduxjs/toolkit';

import { TableT } from '../../components/Record/RecordTable/RecordTableData';
import { HostPageResponseDto } from '../../response-dto/host-page.response-dto';
import { PageType, QueryType } from '../../types/request.type';
import { loadHostRecords } from '../thunk/host-record.thunk';

export type HostStoreT = HostPageResponseDto & {
  loaded: boolean;
  options: PageType & QueryType;

  table: TableT;
};

export const hostRecordStore = createSlice({
  name: 'host_record',
  initialState: {
    loaded: false,
    options: {},

    page: 1,
    per_page: 6,
    total: 100,

    items: [],

    table: {
      columns: new Array(3).fill(''),
      rows: new Array(6).fill(new Array(3).fill('')),
    },
  } as HostStoreT,

  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadHostRecords.fulfilled,
      (state, { payload: { options, res } }) => {
        state.loaded = true;
        state.options = options;

        state.page = res.page;
        state.total = res.total;
        state.items = res.items;

        state.table = {
          columns: Object.keys(res.items[0] ?? {}),
          rows: [],
        };
        for (const item of res.items) {
          state.table.rows.push(
            state.table.columns.map((k) => String(item[k])),
          );
        }
      },
    );
  },
});