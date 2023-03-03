<template>
  <div class="box">
    <el-menu :default-active="'1'" class="menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">公开数据集列表</el-menu-item>
      <el-menu-item index="2">数据集需求列表</el-menu-item>
    </el-menu>
    <template v-if="activeIndex === '1'">
      <el-form class="filter-form" ref="form" :model="searchObj">
        <el-form-item label="标签">
          <el-select
            v-model="searchObj.tag"
            placeholder="可按标签筛选"
            filterable
            multiple
          >
            <el-option
              v-for="(item,index) in allTags"
              :key="index"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            placeholder="可按标题筛选"
            v-model="searchObj.title"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="card-container" v-if="copylist.length > 0">
        <div class="card" v-for="(card, index) in pageList[pageNum-1]" :key="index" @click="clickCard(card)">
          <div class="data-block">
            <div class="title">标题：{{ card[0] }}</div>
            <div class="desc">描述：{{ card[1] || '还没有描述~'}}</div>
            <el-tag
              :key="tag"
              v-for="tag in card[2].split(',')"
              v-if="card[2].split(',')[0] !== ''"
              :disable-transitions="false">
              {{tag}}
            </el-tag>
            <el-tag
              :disable-transitions="false"
              v-else>
              暂无标签
            </el-tag>
          </div>
          <div class="block">
            <el-carousel height="120px" v-if="card[7].length > 0">
              <el-carousel-item v-for="item in card[7]" :key="item">
                <img :src="item" alt="">
              </el-carousel-item>
            </el-carousel>
            <div class="no-pic" v-else>
              <i class="el-icon-picture-outline"></i>
              <p>暂无图片</p>
            </div>
          </div>
        </div >
      </div>
      <div v-else class="no_data">暂无符合条件的数据</div>
      <el-dialog title="详细内容" :visible.sync="DialogVisible" width="800px" class="dialog">
        <el-form>
          <el-form-item label="标题:">
            {{ nowCard[0] }}
          </el-form-item>
          <el-form-item label="详细描述: " class="dialog-desc">
            {{ nowCard[1] || '还没有描述~' }}
          </el-form-item>
          <el-form-item label="标签: ">
            <el-tag
              :key="tag"
              v-for="tag in nowCard[2].split(',')"
              v-if="nowCard[2].split(',')[0] !== ''"
              :disable-transitions="false">
              {{ tag }}
            </el-tag>
            <el-tag
              :disable-transitions="false"
              v-else>
              暂无标签
            </el-tag>
          </el-form-item>
          <el-form-item label="下载文件: " class="downloadFile">
            <template v-if=" nowCard[3] === '1' ">
              <i class="el-icon-files"></i>
              {{ nowCard[4].slice(nowCard[4].lastIndexOf('/') + 1) || '' }}
              <el-button type="primary" size="small" @click="downloadFile" class="btn">下载文件</el-button>
            </template>
            <template v-else>
              数据集作者未上传文件，请尝试和作者联系
              <i class="el-icon-bottom"></i>
            </template>
          </el-form-item>
          <el-form-item label="文件链接：" class="dialog-desc">
            <a :href="nowCard[5]" class="email" v-if="nowCard[5]" target="_blank"
            >{{nowCard[5]}}<i class="el-icon-s-promotion"></i
            ></a>
            <div v-else>还没有链接~</div>
          </el-form-item>
          <div class="block">
            <el-carousel trigger="click" height="300px" v-if="nowCard[7].length > 0">
              <el-carousel-item v-for="item in nowCard[7]" :key="item">
                <img :src="item" alt="">
              </el-carousel-item>
            </el-carousel>
          </div>
          <el-collapse v-model="activeNames" @change="contactHandle">
            <el-collapse-item title="数据拥有者联系方式" name="1">
              <el-form-item label="作者姓名">
                {{ nowCard[9] || '暂无姓名信息' }}
              </el-form-item>
              <el-form-item label="作者邮箱" class="email">
                {{ nowCard[10] || '暂无邮箱信息' }}
                <a :href="'mailto:' + nowCard[10]" class="a-email" v-if="nowCard[10]" target="_blank"
                >邮件联系<i class="el-icon-s-promotion"></i
                ></a>
              </el-form-item>
              <el-form-item label="作者地址">
                {{ nowCard[11] || '暂无地址信息' }}
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-dialog>
      <el-pagination
        background
        layout="prev, pager, next"
        class="page"
        :current-page.sync="pageNum"
        :page-size="1"
        :total="pageList.length">
      </el-pagination>
    </template>
    <template v-else>
      <el-form class="filter-form" :model="searchObj2">
        <el-form-item label="标题">
          <el-input
            placeholder="可按标题筛选"
            v-model="searchObj2.title"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div v-if="demandCopyList.length > 0" class="card-container">
        <div class="card2" v-for="(card, index) in pageList2[pageNum2-1]" :key="index">
          <div class="data-block">
            <div class="title">标题：{{ card[0] }}</div>
            <div class="desc">描述：{{ card[1] || '还没有描述~'}}</div>
            <div>联系方式<i class="el-icon-bottom"></i></div>
            <div class="name">姓名：{{ card[2] }}</div>
            <div class="name">
              邮箱：{{ card[3] }}
              <a :href="'mailto:' + card[3]" class="a-email" target="_blank"
              >邮件联系<i class="el-icon-s-promotion"></i
              ></a>
            </div>
            <div class="name">地址：{{ card[4] || '暂无地址'}}</div>
          </div>
        </div>
      </div>
      <div v-else class="no_data">暂无符合条件的数据</div>
      <el-pagination
        background
        layout="prev, pager, next"
        class="page"
        :current-page.sync="pageNum2"
        :page-size="1"
        :total="pageList2.length">
      </el-pagination>
    </template>
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
    <div class="footer">
<!--      <div class="title">-->
<!--        联系我们-->
<!--      </div>-->
      <img src="@/assets/zjucss.png" alt="" class="logo">
      <div class="line">
        <span>地址</span>
        <span>邮箱</span>
        <span>公众号</span>
      </div>
      <div class="detail_line">
        <div>浙江大学紫金港校区公共管理学院一楼 杭州市余杭塘路866号12333</div>
        <div>zjucss@zju.edu.cn</div>
        <div><img src="@/assets/wechat.png" alt=""></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page",
  data() {
    return {
      activeIndex: '1',
      pageNum: 1,
      pageNum2: 1,
      activeNames: 0,
      tags: ['1','5', 'asd'],
      DialogVisible: false,
      feedbackVisible: false,
      feedback: '',
      list: [],
      nowCard: ['', '', '', '', '', '', '', []],
      searchObj: {
        title: '',
        tag: []
      },
      searchObj2: {
        title: ''
      },
      demandList: []
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
    clickCard(card) {
      this.DialogVisible = true
      console.log(card);
      this.nowCard = card
    },
    handleSelect(index) {
      this.activeIndex = index
    },
    contactHandle() {},
    downloadFile() {
      window.open('http://10.72.100.6:8889/downloadFile/' + this.nowCard[0])
    }
  },
  mounted() {
    const url = 'http://10.72.100.6:8889/getList'
    this.$http.get(url).then(res => {
      this.list = res.data.list
      this.list.forEach((item, index) => {
        let img_num = Number(item[6])
        const arr = new Array(img_num).fill(0).map((item, index) => index)
        item[7] = arr.map(d => {
          return 'http://10.72.100.6:8889/getImg/' + item[0] + '/' + d
        })
      })
    })
    this.$http.get('http://10.72.100.6:8889/getDemandList').then(res => {
      this.demandList = res.data.list
    })
  },
  computed: {
    pageList() {
      const res = []
      for(let i=0;i<this.copylist.length;i += 6) {
        res.push(this.copylist.slice(i, i+6))
      }
      return res
    },
    pageList2() {
      const res = []
      for(let i=0;i<this.demandCopyList.length;i += 6) {
        res.push(this.demandCopyList.slice(i, i+6))
      }
      return res
    },
    allTags() {
      const set = new Set()
      this.list.forEach(item => {
        item[2].split(',').forEach(tag => {
          tag && set.add(tag)
        })
      })
      return Array.from(set)
    },
    copylist() {
      let res = this.list
      const tags = this.searchObj.tag
      const title = this.searchObj.title
      tags.length > 0 && tags.forEach(tag => {
        res = res.filter(item => {
          return item[2] != '' && item[2].split(',').includes(tag)
        })
      })
      if(title !== '') {
        res = res.filter(item => {
          return new RegExp(title).test(item[0])
        })
      }
      return res
    },
    demandCopyList() {
      let res = this.demandList
      const title = this.searchObj2.title
      if(title !== '') {
        res = res.filter(item => {
          return new RegExp(title).test(item[0])
        })
      }
      return res
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
.page {
  width: 300px;
  display: block;
  margin: 10px auto;
  text-align: center;
}
.preview-block {
  margin-top: 15px;
  width: 280px;
  height: 120px;
  position: relative;
  overflow: hidden;
}
.card-container {
  width: 1040px;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
}
.card:not(:nth-child(3n)) {
  margin-right: 52px;
}
.card2:not(:nth-child(3n)) {
  margin-right: 52px;
}
.card2 {
  border: 1px solid #e6e6e6;
  border-radius: 7px;
  padding: 15px;
  background: #fff;
  width: 280px;
  height: 260px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  margin-bottom: 50px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
  &:hover {
    transform: translateY(-4px);
    transition: transform 0.5s;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
    // border: 0;
  }
  .data-block {
    margin: 5px 0;
    .title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .desc {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: small;
      color: grey;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      line-height: 20px;
      height: 100px;
    }
    .name {
      margin-top: 10px;
      font-size: small;
      color: grey;
      a {
        color: lightblue;
      }
    }
  }
}
.card {
  border: 1px solid #e6e6e6;
  border-radius: 7px;
  padding: 15px;
  background: #fff;
  width: 280px;
  height: 250px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  margin-bottom: 50px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
  &:hover {
    transform: translateY(-4px);
    transition: transform 0.5s;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
    // border: 0;
  }
  .data-block {
    margin: 5px 0;
    .title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .desc {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: small;
      color: grey;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 20px;
      height: 40px;
    }
  }
  .el-tag {
    margin-bottom: 10px;
  }
  .no-pic {
    text-align: center;
    i {
      margin-top: 12%;
      font-size: 60px;
      color: #999999;
      display: block;
    }
    p {
      font-size: 10px;
      color: #999999;
    }
  }
}
.el-tag + .el-tag {
   margin-left: 10px;
 }
.dialog {
  .title {
    font-size: 16px;
  }
  .dialog-desc {
    margin-top: -22px;
    margin-bottom: 10px;
    font-size: 15px;
    color: grey;
  }
  .downloadFile {
    .btn {
      margin-left: 10px;
    }
    color: gray;
  }
}
.block {
  img {
    width: 80%;
    height: 100%;
    object-fit: contain;
    padding-left: 10%;
  }
  margin-bottom: 20px;
}
.email {
  a {
    margin-left: 10px;
  }
}
.filter-form {
  margin: 30px 0 0 100px;
  display: flex;
  .el-form-item {
    margin-right: 20px;
    display: flex;
  }
}
.no_data {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
  color: #333;
}
.box {
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
  padding-bottom: 200px;
  position: relative;
}
.feedback {
  position: absolute;
  bottom: 250px;
  right: 12px;
}
.tip {
  position: absolute;
  bottom: 230px;
  right: 20px;
  font-size: 12px;
  color: #999;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #f5f5f5;
  box-shadow: 0px -4px 4px rgba(0,0,0,0.1);
  width: 100%;
  height: 200px;
  .title {
    position: absolute;
    left: 15px;
    top: 10px;
    font-size: 16px;
    color: #000;
  }
  .logo {
    position: absolute;
    top: 40px;
    left: 35px;
    width: 100px;
  }
  .line {
    margin-top: 60px;
    display: flex;
    span {
      width: 33%;
      text-align: center;
      color: #333;
    }
  }
  .detail_line {
    display: flex;
    margin-top: 10px;
    div {
      width: 33%;
      box-sizing: border-box;
      color: #999;
      text-align: center;
      padding: 0 50px;
      img {
        margin-top: -10px;
        width: 100px;
      }
    }
  }
}

.feedback_btn {
  margin-top: 30px;
  margin-left: 480px;
  margin-bottom: -10px;
}
</style>