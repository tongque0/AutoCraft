<template>
  <t-dialog v-model:visible="formVisible" header="新建角色" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit" labelAlign="top">
        <t-form-item>
          <t-tag theme="primary" variant="outline" style="margin: 10px;">用户名</t-tag><t-input v-model="formData.username"
            :style="{ width: '200px' }" style="margin-right: 20px;" />
          <t-tag theme="primary" variant="outline" style="margin: 10px;">密码</t-tag><t-input v-model="formData.password"
            placeholder="请输入内容" :style="{ width: '200px' }"></t-input>
        </t-form-item>
        <t-form-item label="邮箱" name="email">
          <t-input v-model="formData.email" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="手机号码" name="phone">
          <t-input v-model="formData.phone" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="用户角色" name="role">
          <t-radio-group v-model="formData.role">
            <t-radio value="1">user</t-radio>
            <t-radio value="2">admin</t-radio>
          </t-radio-group>
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
import { fromPairs } from 'lodash';
import { Register} from '@/api/user';

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
    const user=await Register(formData.value.phone,formData.value.email,formData.value.password)
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
</script>


