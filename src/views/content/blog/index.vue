<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in typeList"
          :key="item.tyId"
          :label="item.name"
          :value="item.tyId"
        />
      </el-select>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >Search</el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="lists"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.blId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="简介" width="500px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.outline }}</span>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.views }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="类型" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type.name }}</span>
        </template>
      </el-table-column>-->

      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="最后修改时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布状态" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.published | statusFilter">{{ row.published|statusOptionsFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button
            v-if="row.published==false"
            size="mini"
            type="text"
            @click="handleModifyStatus(row,true)"
          >Publish</el-button>
          <el-button
            v-if="row.published==true"
            size="mini"
            type="text"
            @click="handleModifyStatus(row,false)"
          >Draft</el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="deleted(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getBlogList"
    />
  </div>
</template>

<script>
import { fetchBlogList, setPublished, deleteBlogById } from "@/api/content/blog";
import { fetchTypeList } from "@/api/content/type";
import Pagination from "@/components/Pagination"; // 分页组件
export default {
  name: "BlogTable",
  components: { Pagination },
  filters: {
    // 发布状态提示文字
    statusFilter(status) {
      const statusMap = {
        true: "success",
        false: "info"
      };
      return statusMap[status];
    },
    // 发布状态样式
    statusOptionsFilter(status) {
      const statusMap = {
        true: "published",
        false: "draft"
      };
      return statusMap[status];
    }
  },

  data() {
    return {
      // tableKey: 0,
      lists: [], // 博客数据
      typeList: [], // 类型数据
      total: 0, // 总记录
      listLoading: true, // 加载状态
      statusOptions: ["published", "draft"], // 发布状态显示标签
      // 查询条件
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        tyId: undefined
      }
    };
  },
  created() {
    this.getBlogList();
    this.getTypeAll();
  },
  methods: {
    /** *
     * 获取博客数据
     */
    getBlogList() {
      this.listLoading = true;
      fetchBlogList(this.listQuery).then(response => {
        this.lists = response.list;
        this.total = response.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 0.3 * 1000);
      });
    },
    /** *
     * 获取所有类型
     */
    getTypeAll() {
      fetchTypeList().then(response => {
        this.typeList = response;
      });
    },
    /** *
     * 点击搜索后重新加载数据
     */
    handleFilter() {
      this.listQuery.page = 1;
      this.getBlogList();
    },
    /** *
     * 更改发布/编辑状态
     */
    handleModifyStatus(row, status) {
      setPublished(row.blId, status).then(response => {
        this.$message({
          message: "操作Success",
          type: "success"
        });
        row.published = !row.published;
      });
    },
    /** *
     * 删除数据
     */
    deleted(row) {
      const blogId = row.blId;
      this.$confirm('是否确认删除用户编号为"' + blogId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteBlogById(blogId);
        })
        .then(() => {
          this.getBlogList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** *
     * 添加页面
     */
    handleCreate() {
      this.$router.push({ path: "add" || "/" });
    },
    /** *
     * 编辑页面
     */
    handleUpdate(row) {
      this.$router.push({ path: "edit", query: { id: row.blId } });
    }
  }
};
</script>
