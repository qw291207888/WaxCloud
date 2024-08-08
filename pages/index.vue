<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Column {
  prop?: string;
  label: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string, value: string }>;
  columns?: Array<Column>;
}

const dynamicColumns1 = ref<Column[]>([
  { prop: 'activationState', label: '蜡材激活状态', width: '235', sortable: false, filterable: true, filterOptions: [
    { label: '全部', value: 'all' },
    { label: '已激活', value: '已激活' },
    { label: '未激活', value: '未激活' }
  ] },
  { prop: 'activationTime', label: '蜡材激活时间', sortable: true, width: '235' },
  {
    label: '相关设备信息',
    columns: [
      { prop: 'equipmentModel', label: '装载设备型号', width: '120', sortable: false },
      { prop: 'equipmentSN', label: '设备SN', width: '106', sortable: false },
      { prop: 'deviceMAC', label: '设备MAC', width: '186', sortable: false },
      { prop: 'deviceIP', label: '设备IP', width: '134', sortable: false },
      { prop: 'iPArea', label: 'IP所在区域', width: '133', sortable: false }
    ]
  },
  {
    label: '相关报警信息',
    columns: [
      { prop: 'goodsfleeing', label: '是否蜡材窜货报警', width: '240', sortable: false, filterable: true, filterOptions: [
        { label: '全部', value: 'all' },
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ]},
      { prop: 'falseAlarm', label: '是否蜡材窜货报警', width: '240', sortable: false, filterable: true, filterOptions: [
        { label: '全部', value: 'all' },
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ]},
      { prop: 'triggerAlarm', label: '最近一次触发报警', sortable: true, width: '164' }
    ]
  }
]);

const selectedColumns = ref<string[]>([]);
const parentSelectionState = ref<Record<string, boolean>>({});
const indeterminateState = ref<Record<string, boolean>>({});

watch(selectedColumns, () => {
  updateParentSelectionState();
}, { deep: true });

const updateParentSelectionState = () => {
  dynamicColumns1.value.forEach(col => {
    if (col.columns) {
      const validSubCols = col.columns.filter(subCol => subCol.prop !== undefined) as Array<Required<Column>>;
      const allSelected = validSubCols.every(subCol => selectedColumns.value.includes(subCol.prop));
      const someSelected = validSubCols.some(subCol => selectedColumns.value.includes(subCol.prop));
      parentSelectionState.value[col.label] = allSelected;
      indeterminateState.value[col.label] = !allSelected && someSelected;
    }
  });
};

const isIndeterminate = (col: Column) => {
  return indeterminateState.value[col.label] || false;
};

const onParentChange = (col: Column) => {
  if (parentSelectionState.value[col.label]) {
    col.columns!.forEach(subCol => {
      if (subCol.prop && !selectedColumns.value.includes(subCol.prop)) {
        selectedColumns.value.push(subCol.prop);
      }
    });
  } else {
    col.columns!.forEach(subCol => {
      const index = selectedColumns.value.indexOf(subCol.prop!);
      if (index > -1) {
        selectedColumns.value.splice(index, 1);
      }
    });
  }
  updateParentSelectionState();
};

updateParentSelectionState();
</script>

<template>
   <div>
    <el-select
      v-model="selectedColumns"
      multiple
      collapse-tags
      placeholder="选择列"
      size="large"
      class="m-2"
      ref="select"
      popper-class="custom-dropdown"
    >
      <template v-for="col in dynamicColumns1" :key="col.label">
        <!-- 父级选项 -->
        <div>
          <el-checkbox
            :indeterminate="isIndeterminate(col)"
            :checked="parentSelectionState[col.label]"
            @change="onParentChange(col)"
          >
            {{ col.label }}
          </el-checkbox>
        </div>
        <!-- 子级选项 -->
        <div v-if="col.columns" style="padding-left: 24px;">
          <el-checkbox
            v-for="subCol in col.columns"
            :key="subCol.prop"
            v-model="selectedColumns"
            :label="subCol.prop"
          >
            {{ subCol.label }}
          </el-checkbox>
        </div>
        <!-- 没有子项的表头 -->
        <el-option v-else :label="col.label" :value="col.prop || col.label">
          {{ col.label }}
        </el-option>
      </template>
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.custom-dropdown {
  padding: 0;
}
</style>