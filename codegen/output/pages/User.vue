<!-- 为避免生成代码未在特定目录报错，故先注释起来 -->
<!--
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
                <dialog-form v-model:visible="formDialogVisible" :data="formData" />
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
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import { GetUserList, DeleteUser } from '@/api/User';
    import { prefix } from '@/config/global';
    import { t } from '@/locales';
    import { useSettingStore } from '@/store';
    import DialogForm from './components/DialogForm.vue';
    const store = useSettingStore();

    const COLUMNS: PrimaryTableCol<TableRowData>[] = [
        { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
                        {
            title: "UserId",
            align: 'left',
            width: 160,
            colKey: 'userId',
            ellipsis: true
        },
                                {
            title: "Username",
            align: 'left',
            width: 160,
            colKey: 'username',
            ellipsis: true
        },
                                {
            title: "Email",
            align: 'left',
            width: 160,
            colKey: 'email',
            ellipsis: true
        },
                                {
            title: "Phone",
            align: 'left',
            width: 160,
            colKey: 'phone',
            ellipsis: true
        },
                                {
            title: "Role",
            align: 'left',
            width: 160,
            colKey: 'role',
            ellipsis: true
        },
                                {
            title: "CreatedAt",
            align: 'left',
            width: 160,
            colKey: 'createdAt',
            ellipsis: true
        },
                                {
            title: "Profile",
            align: 'left',
            width: 160,
            colKey: 'profile',
            ellipsis: true
        },
                        {
            //@ts-ignore
            title: t('pages.listBase.operation'),
            align: 'left',
            fixed: 'right',
            width: 160,
            colKey: 'op',
        },
    ];
    const INITIAL_DATA: any = {};
    const formData = ref({ ...INITIAL_DATA });
    const data = ref([]);
    const pagination = ref({
        defaultPageSize: 20,
        total: 100,
        defaultCurrent: 1,
    });

    const formDialogVisible = ref(false);
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
            const { id } = data.value[deleteIdx.value];
            return `删除后，${id}的所有信息将被清空，且无法恢复`;
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

    const onConfirmDelete = async () => {
        if (deleteIdx.value > -1) {
            // 基于当前页的索引找到用户的完整信息，特别是 id
            const id = data.value[deleteIdx.value].id;

            try {
                // 发送删除请求
                await DeleteUser(userIdToDelete);

                // 从 data 中找到并删除用户
                const indexInData = data.value.findIndex(user => user.id === userIdToDelete);
                if (indexInData !== -1) {
                    data.value.splice(indexInData, 1);
                    pagination.value.total -= 1; // 更新总数据量
                }

                // 如果删除的是当前选中的行，从 selectedRowKeys 中移除
                const selectedIdx = selectedRowKeys.value.indexOf(userIdToDelete);
                if (selectedIdx > -1) {
                    selectedRowKeys.value.splice(selectedIdx, 1);
                }

                MessagePlugin.success('删除成功');
            } catch (error) {
                console.error('删除失败:', error);
                MessagePlugin.error('删除失败');
            } finally {
                confirmVisible.value = false;
                resetIdx();
            }
        }
    };

    const onCancel = () => {
        resetIdx();
    };

    const rowKey = 'userId';

    const rehandleSelectChange = (val: string[]) => {
        selectedRowKeys.value = val;
    };
    const rehandlePageChange = async (curr: { current: number; pageSize: number; }, pageInfo: any) => {
        // 更新分页信息
        pagination.value.defaultCurrent = curr.current;
        pagination.value.defaultPageSize = curr.pageSize;

        // console.log('分页变化', curr, pageInfo);
    };
    const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
        // console.log('统一Change', changeParams, triggerAndData);
    };
    const handleClickDetail = () => {
        formDialogVisible.value = true
        formData.value = {};
    };
    const handleSetupContract = () => {
        formDialogVisible.value = true
        formData.value = {};
    };
    const handleClickDelete = (row: { rowIndex: any }) => {
        deleteIdx.value = row.rowIndex + (pagination.value.defaultCurrent - 1) * pagination.value.defaultPageSize;
        console.log(deleteIdx.value, pagination.value)
        confirmVisible.value = true;
    };

    const headerAffixedTop = computed(
        () =>
            ({
                offsetTop: store.isUseTabsRouter ? 48 : 0,
                container: `.${prefix}-layout`,
            }) as any,
    );
    watch(formDialogVisible, (newValue, oldValue) => {
        if (!newValue) {
            fetchData();
        }
    });
    </script>
    ` 

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
-->

<!-- api部分，复制粘贴至api目录下，新建User.ts文件
import { request } from '@/utils/request';

const Api = {
    User:'/User/',
    Login: '/user/login',
    Register: '/user/reg',
    UserList:'/User/allsimple'
};


export function GetUserList(){
    return request.get<any>({
        url:Api.UserList
    })
}
export function DeleteUser(id: any){
    return request.delete<any>({
        url:`${Api.User}${id}`
    })
}
export function CreateUser(data:any){
    return request.post<any>({
        url:`${Api.User}${id}`,
        data:data
    })
}
-->

<!-- 弹窗组件部分，复制在对应组件目录下，可参照user，role的实现-->
<!-- <template>
    <t-dialog v-model:visible="formVisible" header="新建角色" :width="680" :footer="false">
      <template #body>
        <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit" labelAlign="top">
            
              <t-form-item label="userId" name="userId">
                <t-input v-model="formData.userId" placeholder="请输入内容"></t-input>
              </t-form-item>
            
              <t-form-item label="username" name="username">
                <t-input v-model="formData.username" placeholder="请输入内容"></t-input>
              </t-form-item>
            
              <t-form-item label="email" name="email">
                <t-input v-model="formData.email" placeholder="请输入内容"></t-input>
              </t-form-item>
            
              <t-form-item label="phone" name="phone">
                <t-input v-model="formData.phone" placeholder="请输入内容"></t-input>
              </t-form-item>
            
              <t-form-item label="role" name="role">
                <t-input v-model="formData.role" placeholder="请输入内容"></t-input>
              </t-form-item>
            
              <t-form-item label="createdAt" name="createdAt">
                <t-input v-model="formData.createdAt" placeholder="请输入内容"></t-input>
              </t-form-item>
            
              <t-form-item label="profile" name="profile">
                <t-input v-model="formData.profile" placeholder="请输入内容"></t-input>
              </t-form-item>
            

            <t-form-item style="float: right">
              <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
              <t-button theme="primary" type="submit">确定</t-button>
         </t-form-item>
      </template>
    </t-dialog>
</template>

<script setup lang="ts">
  import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
  import { fromPairs } from 'lodash';
  import { CreateUser} from '@/api/user';

  const INITIAL_DATA: any = {};

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    data: Object as PropType<any>,
  });
  const formVisible = ref(false);
  const formData = ref({ ...INITIAL_DATA });

  const onSubmit = async ({ validateResult, firstError }: SubmitContext<FormData>) => {
    // 早期返回处理错误情况
    if (firstError) {


      console.log('Errors: ', validateResult);
      MessagePlugin.warning(firstError);
      return;
    }
    console.log(formData.value)
    try {
      const user=await CreateUser(formData.value)
      console.log(user)
      MessagePlugin.success('提交成功');
      formVisible.value = false;
    } catch (error) {
      // 处理异步操作中可能出现的错误
      console.error('Error in CreateRoleRoutes: ', error);
      MessagePlugin.error('提交失败');
    }
  };

  const onClickCloseBtn = () => {
    formVisible.value = false;
    formData.value = { ...INITIAL_DATA };
  };

  const emit = defineEmits(['update:visible']);
  watch(
    () => formVisible.value,
    (val) => {
      emit('update:visible', val);
    },
  );

  watch(
    () => props.visible,
    (val) => {
      formVisible.value = val;
    },
  );

  watch(
    () => props.data,
    (val) => {
      formData.value = val;
    },
  );

  const rules: FormRules<any> = {
    name: [{ required: true, message: '请输入用户名称', type: 'error' }],
  };
</script> -->
