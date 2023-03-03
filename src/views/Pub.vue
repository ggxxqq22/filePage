<template>
  <div>
    <el-menu :default-active="'1'" class="menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">发布公开数据集</el-menu-item>
      <el-menu-item index="2">发布数据集需求</el-menu-item>
    </el-menu>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form" v-show="menuIndex === '1'">
      <div class="form_tip">您可以在这里发布你所拥有的数据集，您可以选择上传文件或不上传文件（需留下您的联系方式便于他人有需求时和您详谈）为了便于他人理解数据内容，请尽可能完善表单内容</div>
      <el-form-item label="数据集名称" prop="title">
        <el-input v-model="form.title" placeholder="请填写数据集名称"></el-input>
      </el-form-item>
      <el-form-item label="数据集简介" prop="detail">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="请选填数据集简介"
          v-model="form.detail">
        </el-input>
      </el-form-item>
      <el-form-item label="数据集标签" prop="tags">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="deleteTag(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="文件上传" prop="file">
        <el-upload
          class="upload-block"
          drag
          action=""
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="form.fileList">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">请上传小于5M的zip文件，因服务器网速受限，如文件过大请上传其他云服务器后填写外部链接地址</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="外部链接" prop="file_link">
        <el-input v-model="form.file_link" placeholder="如有需求，请填写外部文件链接"></el-input>
      </el-form-item>
      <el-form-item label="图片上传" prop="img">
        <el-upload
          class="img_upload"
          action=""
          :auto-upload="false"
          :on-change="handleImgChange"
          :file-list="form.imgList"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <div class="contact_tip">如有需求，可留下您的联系方式供他人咨询或进一步沟通</div>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请选填数据集拥有者姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请选填数据集拥有者邮箱"></el-input>
      </el-form-item>
      <el-form-item label="通讯地址" prop="address">
        <el-input v-model="form.address" placeholder="请选填数据集拥有者通讯地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancle">取消</el-button>
      </el-form-item>
    </el-form>
    <el-form :model="form2" :rules="rules2" ref="form2" label-width="100px" class="form" v-show="menuIndex === '2'">
      <div class="form_tip">
        您可以在这里发布您的数据需求，可以是已有数据集的处理任务，也可以是具体的数据集需求，为了便于他人理解，请尽可能完善表单内容
      </div>
      <el-form-item label="需求标题" prop="title">
        <el-input v-model="form2.title" placeholder="请填写需求标题"></el-input>
      </el-form-item>
      <el-form-item label="需求介绍" prop="detail">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="请填写需求详细介绍并说明具体情况"
          v-model="form2.detail">
        </el-input>
      </el-form-item>
      <div class="contact_tip">请留下您的联系方式供他人咨询或进一步沟通</div>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form2.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form2.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="通讯地址" prop="address">
        <el-input v-model="form2.address" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit2">提交</el-button>
        <el-button @click="onCancle">取消</el-button>
      </el-form-item>
    </el-form>
    <el-button icon="el-icon-message" circle class="feedback" @click="feedbackDialog"></el-button>
    <div class="tip">反馈</div>
    <el-dialog title="反馈内容" :visible.sync="feedbackVisible" width="600px" class="feedback_dialog">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder=""
        v-model="feedback">
      </el-input>
      <el-button type="primary" class="feedback_btn" @click="uploadFeedback">提交<i class="el-icon-upload el-icon--right"></i></el-button>
    </el-dialog>
    <div class="contact">
      <div class="title">联系我们</div>
      <div class="divide"></div>
      <img src="@/assets/zjucss.png" class="logo" />
      <p class="loc">地址</p>
      <p class="loc_detail">浙江大学紫金港校区公共管理学院一楼 杭州市余杭塘路866号</p>
      <p class="email">邮箱</p>
      <p class="email_detail">zjucss@zju.edu.cn</p>
      <p class="wechat">微信公众号</p>
      <img src="@/assets/wechat.png" class="wechat_detail" alt="">
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "Pub",
  data() {
    return {
      feedbackVisible: false,
      feedback: '',
      form: {
        title: '',
        detail: '',
        tags: [],
        fileList: [],
        file_link: '',
        imgList: [],
        name: '',
        email: '',
        address: ''
      },
      form2: {
        title: '',
        detail: '',
        name: '',
        email: '',
        address: ''
      },
      menuIndex: '1',
      rules: {
        title: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        detail: [
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        name: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
        ],
      },
      rules2: {
        title: [
          { required: true, message: '请输入需求标题', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请输入需求详细介绍', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 300 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
      },
      inputVisible: false,
      inputValue: ''
    };
  },
  methods: {
    uploadFeedback() {
      const formData = new FormData()
      formData.append('feedback', this.feedback)
      this.$http.post('http://10.72.100.6:8889/feedback', formData).then(res => {
        const data = res.data
        if(data.code===0) {
          this.$message({
            message: '反馈提交成功',
            type: 'success'
          });
        } else {
          this.$message.error(data.msg);
        }
      }).finally(_ => {
        this.feedbackVisible = false
        this.feedback = ''
      })
    },
    feedbackDialog() {
      this.feedbackVisible = true
    },
    onSubmit() {
      const url = 'http://10.72.100.6:8889/uploadFile/' + moment().format()
      if(this.form.title === '') {
        this.$message("请填写标题")
        return
      }
      const formData = new FormData()
      let is_file = 0, is_img = 0
      if(this.form.fileList.length === 1) {
        console.log(this.form.fileList[0].raw);
        if(this.form.fileList[0].raw.size > 5 * 1024 * 1024) {
          this.$message("因网络受限，请不要上传大于5M的文件")
          this.form.fileList = []
          return
        } else {
          is_file = 1
          formData.append('file', this.form.fileList[0].raw)
        }
      }
      if(this.form.imgList.length > 0) {
        is_img = this.form.imgList.length
        this.form.imgList.forEach(item => {
          formData.append('file', item.raw)
        })
      }
      formData.append('title', this.form.title)
      formData.append('detail', this.form.detail)
      formData.append('tags', this.form.tags.join(','))
      formData.append('is_file', is_file)
      formData.append('is_img', is_img)
      formData.append('file_link', this.form.file_link)
      formData.append('name', this.form.name)
      formData.append('email', this.form.email)
      formData.append('address', this.form.address)
      this.$http.post(url, formData).then(res => {
        const data = res.data
        if(data.code === 0) {
          this.$message({
            message: '提交成功，将跳转主页',
            type: 'success'
          });
          setTimeout(()=>{
            this.$router.push('/home')
          }, 1500)
        } else {
          this.$alert(data.msg, '错误,请重试', {
            confirmButtonText: '确定',
          }).then(()=>{
            location.reload()
          })
        }
      })
    },
    onSubmit2() {
      const url = 'http://10.72.100.6:8889/uploadDemand/' + moment().format()
      const formData = new FormData()
      formData.append('title', this.form2.title)
      formData.append('detail', this.form2.detail)
      formData.append('name', this.form2.name)
      formData.append('email', this.form2.email)
      formData.append('address', this.form2.address)
      this.$http.post(url, formData).then(res => {
        const data = res.data
        if(data.code === 0) {
          this.$message('提交成功，将跳转主页');
          setTimeout(()=>{
            this.$router.push('/home')
          }, 1500)
        } else {
          this.$alert(data.msg, '错误,请重试', {
            confirmButtonText: '确定',
          }).then(()=>{
            location.reload()
          })
        }
      })
    },
    onCancle() {
      this.$router.push('/home')
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList
      if(this.form.fileList.length > 1) {
        this.form.fileList = this.form.fileList.slice(0,1)
        this.$message.error('只能上传1个文件');
      }
    },
    handleImgChange(img, imgList) {
      this.form.imgList = imgList
    },
    handleSelect(index) {
      this.menuIndex = index
    },
    deleteTag(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        if(this.form.tags.some(item => item === inputValue)) {
          this.$message.error('标签重复');
        } else {
          this.form.tags.push(inputValue);
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
};
</script>

<style scoped lang="less">
.menu {
  padding-left: 20px;
}
::v-deep .el-menu {
  .el-menu-item {
    margin-left: 20px !important;
  }
}
.contact_tip {
  margin-left: 100px;
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
}
.form {
  width:  800px;
  margin: 60px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.contact {
  position: absolute;
  top: 204px;
  left: 980px;
  width: 220px;
  height: 511px;
  border-radius: 15px;
  background-color: #fff;
  padding-right: 15px;
  .title {
    color: #010101;
    margin: 24px 0 24px 24px;
    font-size: 18px;
  }
  .divide {
    border: 1px solid #F3F3F3;
  }
  .logo {
    width: 105px;
    height: 24px;
    margin: 33px 0 0 24px;
  }
  .loc, .email, .wechat {
    font-size: 15px;
    color: #010101;
    margin-top: 16px;
    margin-left: 24px;
  }
  .loc_detail, .email_detail {
    font-size: 13px;
    color: #93989A;
    margin-top: 10px;
    margin-left: 24px;
  }
  .wechat_detail {
    width: 160px;
    margin: 12px auto;
    display: block;
  }
}
.feedback {
  position: absolute;
  bottom: -10px;
  right: 15px;
}
.tip {
  position: absolute;
  bottom: -45px;
  right: 23px;
  font-size: 12px;
  color: #999;
  height: 50px;
  line-height: 50px;
}
.feedback_btn {
  margin-top: 30px;
  margin-left: 480px;
  margin-bottom: -10px;
}
.form_tip {
  margin-top: -20px;
  margin-bottom: 20px;
  margin-left: 10px;
  line-height: 25px;
  font-size: 15px;
  color: #777;
}
</style>