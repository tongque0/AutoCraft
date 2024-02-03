<template>
    <div>
        <div class="list-card-operation">
            <t-button @click='handleCreateRole'> 新建角色 </t-button>
            <div class="search-input">
                <t-input v-model="searchValue" :placeholder="$t('pages.listCard.placeholder')" clearable>
                    <template #suffix-icon>
                        <search-icon v-if="searchValue === ''" size="var(--td-comp-size-xxxs)" />
                    </template>
                </t-input>
            </div>
        </div>

        <dialog-form v-model:visible="formDialogVisible" :data="formData" />

        <template v-if="pagination.total > 0 && !dataLoading">
            <div class="list-card-items">
                <t-row :gutter="[16, 16]">
                    <t-col v-for="product in productList.slice(
                        pagination.pageSize * (pagination.current - 1),
                        pagination.pageSize * pagination.current,
                    )" :key="product.index" :lg="4" :xs="6" :xl="3">
                        <product-card class="list-card-item" :product="product" @delete-item="handleDeleteItem"
                            @manage-product="handleManageRole" />
                    </t-col>
                </t-row>
            </div>
            <div class="list-card-pagination">
                <t-pagination v-model="pagination.current" v-model:page-size="pagination.pageSize" :total="pagination.total"
                    :page-size-options="[12, 24, 36]" @page-size-change="onPageSizeChange"
                    @current-change="onCurrentChange" />
            </div>
        </template>

        <div v-else-if="dataLoading" class="list-card-loading">
            <t-loading text="加载中..." size="small"></t-loading>
        </div>

        <t-dialog v-model:visible="confirmVisible" header="确认删除角色？" :body="confirmBody" :on-cancel="onCancel"
            @confirm="onConfirmDelete" />
    </div>
</template>

<script lang="ts">
export default {
    name: 'ListCard',
};
</script>

<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, onMounted, ref, watch } from 'vue';

import { GetRoleList, GetRoleable, DeleteRoleable } from '@/api/role';
import type { CardProductType } from '@/components/product-card/index.vue';
import ProductCard from './components/ProductCard.vue';

import type { FormData, Permission } from './components/DialogForm.vue';
import DialogForm from './components/DialogForm.vue';

const INITIAL_DATA: FormData = {
    roleId:-1,
    name: '',
    status: '',
    permissions: []
};

const pagination = ref({ current: 1, pageSize: 12, total: 0 });
const deleteProduct = ref(undefined);

const productList = ref([]);
const dataLoading = ref(true);

const fetchData = async () => {
    try {
        const list = await GetRoleList();
        productList.value = list;
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

const confirmBody = computed(() =>
    deleteProduct.value ? `确认删除后${deleteProduct.value.name}的所有产品信息将被清空, 且无法恢复` : '',
);

onMounted(() => {
    fetchData();
});

const formDialogVisible = ref(false);
const searchValue = ref('');
const confirmVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

const onPageSizeChange = (size: number) => {
    pagination.value.pageSize = size;
    pagination.value.current = 1;
};
const onCurrentChange = (current: number) => {
    pagination.value.current = current;
};
const handleDeleteItem =(product: CardProductType) => {
    confirmVisible.value = true;
    deleteProduct.value = product;
};
const onConfirmDelete = async () => {
    const { id } = deleteProduct.value;
    try {
        await DeleteRoleable(id);
    } catch (error) {
        console.error('删除失败: ', error);
        MessagePlugin.error('删除失败');
    }
    confirmVisible.value = false;
    MessagePlugin.success('删除成功');
    fetchData()
};
const onCancel = () => {
    deleteProduct.value = undefined;
    formData.value = { ...INITIAL_DATA };
};
const initializePermissions = (permissions: Permission[]): Permission[] => {
    return permissions.map(permission => {
        const initializedChildren = permission.children
            ? initializePermissions(permission.children) // 递归初始化子权限
            : [];

        return {
            ...permission,
            children: initializedChildren,
            selectedOptions: permission.enable
                ? initializedChildren.map(child => child.id)
                : [],
            accessType: permission.level > 3 ? 'readWrite' : 'read', // 根据实际逻辑调整
        };
    });
};

const handleManageRole = async (product: CardProductType) => {
    formDialogVisible.value = true;
    const list = await GetRoleable(product.name);
    formData.value = {
        roleId:product.id,
        name: product.name,
        status: product?.isSetup ? '1' : '0',
        permissions: initializePermissions(list),
    };
};
const handleCreateRole = async () => {
    formDialogVisible.value = true;
    const list = await GetRoleable();
    formData.value = {
        roleId:-1,
        name: '',
        status: '',
        permissions: list,
    };
};

watch(formDialogVisible, (newValue, oldValue) => {
    if (!newValue) {
        fetchData();
    }
});
</script>

<style lang="less" scoped>
.list-card {
    height: 100%;

    &-operation {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--td-comp-margin-xxl);

        .search-input {
            width: 360px;
        }
    }

    &-item {
        padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);

        :deep(.t-card__header) {
            padding: 0;
        }

        :deep(.t-card__body) {
            padding: 0;
            margin-top: var(--td-comp-margin-xxl);
            margin-bottom: var(--td-comp-margin-xxl);
        }

        :deep(.t-card__footer) {
            padding: 0;
        }
    }

    &-pagination {
        padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);
    }

    &-loading {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
