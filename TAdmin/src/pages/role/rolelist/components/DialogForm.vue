<template>
  <t-dialog v-model:visible="formVisible" :header="$t('pages.listCard.create')" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item label="角色类型" name="name">
          <t-input v-model="formData.name" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item label="角色状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio value="0">{{ $t('pages.listCard.productStatusEnum.off') }}</t-radio>
            <t-radio value="1">{{ $t('pages.listCard.productStatusEnum.on') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <div v-for="permission in formData.permissions" :key="permission.name" class="permission-item">
          <t-form-item :label="permission.title.zh_CN" :name="permission.name">
            <t-select v-model="permission.selectedOptions" :options="getSelectOptions(permission.children)"
              :min-collapsed-num="2" placeholder="选择权限" :style="{ width: '250px' }" multiple />
            <t-radio-group v-model="permission.accessType" style="margin-left: 20px;">
              <t-radio value="read">仅读</t-radio>
              <t-radio value="readWrite">读写</t-radio>
            </t-radio-group>
          </t-form-item>
        </div>

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
export interface FormData {
  name: string;
  status: string;
  permissions: Permission[],
}
export interface Permission {
  id: number;
  name: string;
  title: { zh_CN: string; en_US: string };
  parent: string | null;
  enable: boolean;
  level: number;
  children: Permission[]; // 假设 children 也遵循同样的结构
  selectedOptions: number[]; // 新增：用于存储选择的子权限
  accessType: 'read' | 'readWrite'; // 新增：用于存储权限类型
}

const INITIAL_DATA: FormData = {
  name: '',
  status: '',
  permissions: [],
};

const getSelectOptions = (children: any) => {
  return children.map((child: { title: { zh_CN: any; }; id: number; }) => ({
    label: child.title.zh_CN,
    value: child.id,
  }));
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
const processPermissions = (permissions: Permission[]) => {
  let result: any = [];

  const processItem = (item: Permission) => {
    item.selectedOptions.forEach((option: any) => {
      selectroutes.value.add(item.id)
      selectroutes.value.add(option)
      result.push({
        parent: item.id,
        id: option,
        level: item.accessType === 'read' ? 3 : 6
      });
    });
  };

  permissions.forEach(permission => processItem(permission));

  return result;
};
const onSubmit = async ({ validateResult, firstError }: SubmitContext<FormData>) => {
  // 早期返回处理错误情况
  if (firstError) {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
    return;
  }
  const routelevel = processPermissions(formData.value.permissions);
  const selectroutesArray = Array.from(selectroutes.value);
  selectroutes.value.clear()

  try {
    // 执行异步操作
    await CreateRoleRoutes(formData.value.name, routelevel, selectroutesArray,formData.value.status);
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
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
};
</script>


