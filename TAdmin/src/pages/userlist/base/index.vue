<template>
    <div>
        <t-card class="list-card-container" :bordered="false">
            <t-row justify="space-between">
                <div class="left-operation-container">
                    <t-button @click="handleSetupContract"> 新建用户 </t-button>
                    <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">
                        导出用户</t-button>
                    <p v-if="!!selectedRowKeys.length" class="selected-count">
                        {{ $t('pages.listBase.select') }} {{ selectedRowKeys.length }} {{ $t('pages.listBase.items') }}
                    </p>
                </div>
                <div class="search-input">
                    <t-input v-model="searchValue" :placeholder="$t('pages.listBase.placeholder')" clearable>
                        <template #suffix-icon>
                            <search-icon size="16px" />
                        </template>
                    </t-input>
                </div>
            </t-row>
            <t-table :data="data" :columns="COLUMNS" :row-key="rowKey" vertical-align="top" :hover="true"
                :pagination="pagination" :selected-row-keys="selectedRowKeys" :loading="dataLoading"
                :header-affixed-top="headerAffixedTop" @page-change="rehandlePageChange" @change="rehandleChange"
                @select-change="rehandleSelectChange">
                <template #role="{ row }">
                    <t-tag v-if="row.role === 'admin'" theme="success" variant="light">
                        管理员</t-tag>
                    <t-tag v-if="row.role === 'user'" theme="primary" variant="light">
                        用户
                    </t-tag>
                </template>
                <template #op="slotProps">
                    <t-space>
                        <t-link theme="primary" @click="handleClickDetail()"> {{ $t('pages.listBase.detail') }}</t-link>
                        <t-link theme="danger" @click="handleClickDelete(slotProps)"> {{ $t('pages.listBase.delete')
                        }}</t-link>
                    </t-space>
                </template>
            </t-table>
        </t-card>

        <t-dialog v-model:visible="confirmVisible" header="确认删除当前所选用？" :body="confirmBody" :on-cancel="onCancel"
            @confirm="onConfirmDelete" />
    </div>
</template>


<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { GetUserList } from '@/api/user';
import Trend from '@/components/trend/index.vue';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useSettingStore } from '@/store';
import { number } from 'echarts';

const store = useSettingStore();

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
    { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
    { title: "用户名", align: 'left', width: 200, colKey: 'username', fixed: 'left' },
    { title: "用户身份", colKey: 'role', width: 160 },
    { title: "用户邮箱", width: 160, ellipsis: true, colKey: 'email' },
    { title: "用户手机号", width: 160, ellipsis: true, colKey: 'phone' },
    { title: "用户地址", width: 160, ellipsis: true, colKey: 'address' },
    {
        //@ts-ignore
        title: t('pages.listBase.operation'),
        align: 'left',
        fixed: 'right',
        width: 160,
        colKey: 'op',
    },
];

const data = ref([]);
const pagination = ref({
    defaultPageSize: 20,
    total: 100,
    defaultCurrent: 1,
});

const searchValue = ref('');

const dataLoading = ref(false);
const fetchData = async () => {
    dataLoading.value = true;
    try {
        const data1 = await GetUserList();
        const list = data1
        data.value = list;
        pagination.value = {
            ...pagination.value,
            total: list.length,
        };
    } catch (e) {
        console.log(e);
    } finally {
        dataLoading.value = false;
    }
};

const deleteIdx = ref(-1);
const confirmBody = computed(() => {
    if (deleteIdx.value > -1) {
        const { name } = data.value[deleteIdx.value];
        return `删除后，${name}的所有信息将被清空，且无法恢复`;
    }
    return '';
});

onMounted(() => {
    fetchData();
});

const confirmVisible = ref(false);

const selectedRowKeys = ref([]);

const router = useRouter();

const resetIdx = () => {
    deleteIdx.value = -1;
};

const onConfirmDelete = () => {
    // 真实业务请发起请求
    data.value.splice(deleteIdx.value, 1);
    pagination.value.total = data.value.length;
    const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value);
    if (selectedIdx > -1) {
        selectedRowKeys.value.splice(selectedIdx, 1);
    }
    confirmVisible.value = false;
    MessagePlugin.success('删除成功');
    resetIdx();
};

const onCancel = () => {
    resetIdx();
};

const rowKey = 'userId';

const rehandleSelectChange = (val: string[]) => {
    selectedRowKeys.value = val;
};
const rehandlePageChange = (curr: unknown, pageInfo: unknown) => {
    console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
    console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = () => {
    router.push('/detail/base');
};
const handleSetupContract = () => {
    router.push('/form/base');
};
const handleClickDelete = (row: { rowIndex: any }) => {
    deleteIdx.value = row.rowIndex;
    // console.log(globalIndex,row)
    confirmVisible.value = true;
};

const headerAffixedTop = computed(
    () =>
        ({
            offsetTop: store.isUseTabsRouter ? 48 : 0,
            container: `.${prefix}-layout`,
        }) as any,
);
</script>

<style lang="less" scoped>
.payment-col {
    display: flex;

    .trend-container {
        display: flex;
        align-items: center;
        margin-left: var(--td-comp-margin-s);
    }
}

.list-card-container {
    padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

    :deep(.t-card__body) {
        padding: 0;
    }
}

.left-operation-container {
    display: flex;
    align-items: center;
    margin-bottom: var(--td-comp-margin-xxl);

    .selected-count {
        display: inline-block;
        margin-left: var(--td-comp-margin-l);
        color: var(--td-text-color-secondary);
    }
}

.search-input {
    width: 360px;
}
</style>
