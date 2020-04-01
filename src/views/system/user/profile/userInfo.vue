<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="name">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item label="用户账号" prop="username">
      <el-input v-model="user.username" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="Wechat">
      <el-input v-model="user.wechat" />
    </el-form-item>
    <el-form-item label="QQ">
      <el-input v-model="user.qq" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="user.about" type="textarea"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        name: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        username: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            // if (response.code === 200) {
              this.msgSuccess("修改成功");
            // } else {
            //   this.msgError(response.msg);
            // }
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
