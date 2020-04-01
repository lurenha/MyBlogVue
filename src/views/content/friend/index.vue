<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.frId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网址" min-width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" class-name="status-col" width="100"  align="center">
        <template slot-scope="{row}">
          <el-tag type="info">{{ row.flag | flagFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简介" prop="description">
              <el-input v-model="temp.description" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网址" prop="website">
              <el-input v-model="temp.website" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别">
              <el-select v-model.number="temp.flag" class="filter-item" placeholder="Please select">
                <el-option label="推荐网站" :value="1" />
                <el-option label="友情链接" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchFriendList,
  deleteFriendById,
  getFriendByid,
  updateFriend,
  addFriend
} from "@/api/content/friend";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "FriendTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    flagFilter(flags) {
      const flagsMap = {
        1: "推荐网站",
        2: "友情链接"
      };
      return flagsMap[flags];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      showReviewer: false,
      temp: {
        frId: undefined,
        name: "",
        description: "",
        website: "",
        flag: 1
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入简介", trigger: "blur" }
        ],
        website: [{ required: true, message: "请输入网址", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchFriendList().then(response => {
        this.list = response;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1 * 200);
      });
    },
    resetTemp() {
      this.temp = {
        frId: undefined,
        name: "",
        description: "",
        website: "",
        flag: 1
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addFriend(this.temp).then(response => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              message: "添加成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      getFriendByid(row.frId).then(response => {
        this.temp = response;
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        // this.$nextTick(() => {
        //   this.$refs["dataForm"].clearValidate();
        // });
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateFriend(this.temp).then(response => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    /** *
     * 删除数据
     */
    handleDelete(row) {
      const frId = row.frId;
      this.$confirm('是否确认删除用户编号为"' + frId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteFriendById(frId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>
