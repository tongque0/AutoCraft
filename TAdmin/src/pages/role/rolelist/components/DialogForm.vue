<template>
  <t-dialog v-model:visible="formVisible" :header="$t('pages.listCard.create')" :width="680" :footer="false">
    <!-- <t-loading text="加载中..." size="small"></t-loading> -->
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit" labelAlign="top">
        <t-form-item label="角色类型" name="name" style="margin-bottom: 10px;">
          <t-input v-model="formData.name" :style="{ width: '200px' }" style="margin-right: 20px;" />
          <t-radio-group v-model="formData.status">
            <t-radio value="0">{{ $t('pages.listCard.productStatusEnum.off') }}</t-radio>
            <t-radio value="1">{{ $t('pages.listCard.productStatusEnum.on') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item style="margin-left: 0;">
          <t-space direction="vertical" size="large">
            <t-tabs :default-value="1">
              <t-tab-panel v-for="permission in formData.permissions" :value="permission.id" :key="permission.name"
                :label="permission.title.zh_CN">
                <template #panel>
                  <div style="display: flex;flex-wrap: wrap;">
                    <div v-for="child in permission.children" :key="child.id">
                      <t-tag theme="primary" variant="outline" style="margin: 10px;">{{ child.title.zh_CN }}</t-tag>
                      <t-switch size="small" v-model="child.enable" />
                      <t-radio-group v-model="child.level" style="margin-left: 20px;">
                        <t-radio :value=3>仅读</t-radio>
                        <t-radio :value="6">读写</t-radio>
                      </t-radio-group>
                    </div>
                  </div>
                </template>
              </t-tab-panel>
            </t-tabs>
          </t-space>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { CreateRoleRoutes } from '@/api/role';
import { fromPairs } from 'lodash';
export interface FormData {
  roleId: number;
  name: string;
  status: string;
  permissions: Permission[],
}
export interface Permission {
  parentRoute: any;
  id: number;
  name: string;
  title: { zh_CN: string; en_US: string };
  parent: string | null;
  enable: boolean;
  level: number;
  children: Permission[]; // 假设 children 也遵循同样的结构
}

const INITIAL_DATA: FormData = {
  roleId: -1,
  name: '',
  status: '',
  permissions: [],
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<FormData>,
});
const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const textareaValue = ref('');
const selectroutes = ref(new Set());
//获取所有选择路由
const flattenPermissions = (permissions: Permission[]): any[] => {
  let result: any[] = [];

  permissions.forEach((permission) => {
    // 添加当前权限
    if (permission.enable === true && permission.parentRoute !== null)
      result.push({
        parent: permission.parentRoute,
        id: permission.id,
        level: permission.level
      });

    // 如果有子权限，则递归地添加它们
    if (permission.children && permission.children.length > 0) {
      result = result.concat(flattenPermissions(permission.children));
    }
  });

  return result;
};
const onSubmit = async ({ validateResult, firstError }: SubmitContext<FormData>) => {
  // 早期返回处理错误情况
  if (firstError) {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
    return;
  }

  const routelevel = flattenPermissions(formData.value.permissions);
  const rolename = formData.value.name;
  const roleId = formData.value.roleId;

  try {
    // 执行异步操作
    await CreateRoleRoutes({ rolename, roleId }, routelevel, formData.value.status);
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
  selectroutes.value.clear()
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

const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入用户名称', type: 'error' }],
};
</script>


