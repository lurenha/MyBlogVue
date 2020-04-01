<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.commentabled" />
        <PlatformDropdown v-model="postForm.tagIds" />
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >Publish</el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">Draft</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>Title</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="Type:" class="postInfo-container-item">
                    <el-select v-model="postForm.tyId" placeholder="请选择类型">
                      <el-option
                        v-for="item in typelist"
                        :key="item.tyId"
                        :label="item.name"
                        :value="item.tyId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
                    label-width="150px"
                    label="ImageUrl:"
                    class="postInfo-container-item"
                  >
                    <el-input placeholder="请输入内容" style="width:400px" v-model="postForm.backgroundImage" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:" prop="outline">
          <el-input
            v-model="postForm.outline"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { getBlogById, addBlog, updateBlog } from "@/api/content/blog";
import { fetchTypeList } from "@/api/content/type";
import { CommentDropdown, PlatformDropdown } from "./Dropdown";

const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  content: "", // 文章内容
  outline: "", // 文章摘要
  backgroundImage: "", // 文章图片
  blId: undefined,
  tyId: 1,
  tagIds: [],
  commentabled: true,
  recommend: false,
  published: false
};

export default {
  name: "ArticleDetail",
  components: { Tinymce, MDinput, Sticky, CommentDropdown, PlatformDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      typelist: [],
      rules: {
        // backgroundImage: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        outline: [{ validator: validateRequire }]
      },
      tempRoute: {}
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.outline.length;
    },
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.query && this.$route.query.id;
      if(!id){
         this.$router.push({ path: "index" });
      }
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }
    fetchTypeList().then(response => {
      this.typelist = response;
    });
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(id) {
      getBlogById(id)
        .then(response => {
          this.postForm = response;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postForm.published = true;
          if (!this.isEdit) {
            addBlog(this.postForm).then(response => {
              this.$notify({
                title: "成功",
                message: "发布成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            updateBlog(this.postForm).then(response => {
              this.$notify({
                title: "成功",
                message: "发布成功",
                type: "success",
                duration: 2000
              });
            });
          }
          if (!this.isEdit) {
            this.postForm = Object.assign({}, defaultForm);
          }
          this.postForm.status = "published";
          this.loading = false;
          this.$router.push({ path: "index" });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    draftForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postForm.published = false;
          if (!this.isEdit) {
            addBlog(this.postForm).then(response => {
              this.$notify({
                title: "成功",
                message: "保存成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            updateBlog(this.postForm).then(response => {
              this.$notify({
                title: "成功",
                message: "保存成功",
                type: "success",
                duration: 2000
              });
            });
          }

          if (!this.isEdit) {
            this.postForm = Object.assign({}, defaultForm);
          }
          this.postForm.status = "draft";
          this.loading = false;
          this.$router.push({ path: "index" });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

</style>
