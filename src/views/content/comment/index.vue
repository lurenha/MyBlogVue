<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="博客">
        <el-select
          v-model="queryParams.blId"
          placeholder="选择博客"
          size="small"
          @change="handleQuery"
          style="width: 300px"
        >
          <el-option
            v-for="dict in blogDic"
            :key="dict.blId"
            :label="dict.title"
            :value="dict.blId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:menu:add']">新增</el-button> -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="commentList"
      row-key="coId"
      :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="name"
        label="评论者名称"
        :show-overflow-tooltip="true"
        width="160"
        align="center"
      ></el-table-column>
      <!-- <el-table-column prop="coId" label="ID" width="60"></el-table-column> -->
      <el-table-column label="父节点" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag type="info" v-if="row.parent">{{ row.parent.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="content" label="内容" align="center"></el-table-column>
      <!-- <el-table-column prop="visible" label="可见" :formatter="visibleFormat" width="80"></el-table-column> -->
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="IP地址" align="center"></el-table-column>
      <el-table-column label="删除状态" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.isDelete | statusFilter">{{ row.isDelete|statusOptionsFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">Edit</el-button> -->
          <el-button
            v-if="row.isDelete==false"
            size="mini"
            type="text"
            @click="handleModifyStatus(row,true)"
          >Delete</el-button>
          <el-button
            v-if="row.isDelete==true"
            size="mini"
            type="text"
            @click="handleModifyStatus(row,false)"
          >Push</el-button>
          <!-- <el-button size="mini" icon="el-icon-delete" type="text" @click="deleted(row)">Delete</el-button> -->
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import { hasCommentDic } from "@/api/content/blog";
import { getCommentWithChildById, setDeleted } from "@/api/content/comment";
export default {
  name: "CommentTable",
  filters: {
    // 删除状态提示文字
    statusFilter(status) {
      const statusMap = {
        true: "info",
        false: "success"
      };
      return statusMap[status];
    },
    // 删除状态样式
    statusOptionsFilter(status) {
      const statusMap = {
        true: "Delete",
        false: "Push"
      };
      return statusMap[status];
    }
  },

  data() {
    return {
      blogDic: [], // 博客字典
      commentList: [], // 评论数据
      loading: false, // 加载状态
      //   statusOptions: ["Push", "Delete"], // 删除状态显示标签
      // 查询条件
      queryParams: {
        blId: -1
      }
    };
  },
  created() {
    this.getBlogDicList();
    this.getComments(this.queryParams.blId);
  },
  methods: {
    /** *
     * 获取博客字典列表
     */
    getBlogDicList() {
      hasCommentDic().then(response => {
        this.blogDic = response;
        this.queryParams.blId = response[0].blId;
        this.getComments(this.queryParams.blId);
      });
    },
    /** *
     * 获取blId对应评论列表
     */
    getComments(blId) {
      this.loading = true;
      getCommentWithChildById(blId).then(response => {
        this.commentList = response;
        setTimeout(() => {
          this.loading = false;
        }, 0.3 * 1000);
      });
    },
    /** *
     * 点击搜索后重新加载数据
     */
    handleQuery() {
      this.getComments(this.queryParams.blId);
    },
    /** *
     * 更改发布/编辑状态
     */
    handleModifyStatus(row, status) {
      setDeleted(row.coId, status).then(response => {
        this.$message({
          message: "操作Success",
          type: "success"
        });
        row.isDelete = !row.isDelete;
      });
    }
    /** *
     * 删除数据
     */
    // deleted(row) {
    //   const blogId = row.blId;
    //   this.$confirm('是否确认删除用户编号为"' + blogId + '"的数据项?', "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(function() {
    //       return deleteBlogById(blogId);
    //     })
    //     .then(() => {
    //       this.getBlogList();
    //       this.msgSuccess("删除成功");
    //     })
    //     .catch(function() {});
    // }
  }
};
</script>
