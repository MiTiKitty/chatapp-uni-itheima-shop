<template>
    <view>
        <view class="goods-list">
            <view class="goods-item" v-for="goods in goodsList" :key="goods.goods_id" @click="gotoDetail(goods)">
                <view class=" left-box">
                    <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
                </view>
                <view class="right-box">
                    <view class="goods-title">
                        <text>{{goods.goods_name}}</text>
                    </view>
                    <view class="goods-price">
                        <text>￥{{goods.goods_price | tofixed}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 请求参数对象
                queryObj: {
                    // 查询关键词
                    query: '',
                    // 商品分类Id
                    cid: '',
                    // 页码值
                    pagenum: 1,
                    // 每页显示多少条数据
                    pagesize: 10
                },
                // 商品列表的数据
                goodsList: [],
                // 总数量，用来实现分页
                total: 0,
                // 默认的空图片
                defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
                // 是否正在请求数据
                isloading: false
            };
        },
        filters: {
            // 把数字处理为带两位小数点的数字
            tofixed(num) {
                return Number(num).toFixed(2)
            }
        },
        onLoad(options) {
            // 将页面参数转存到 this.queryObj 对象中
            this.queryObj.query = options.query || ''
            this.queryObj.cid = options.cid || ''
            this.getGoodsList()
        },
        onReachBottom() {
            // 判断是否还有下一页数据
            if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
                return uni.$showMsg('数据加载完毕！')
            }
            // 判断是否正在请求其它数据，如果是，则不发起额外的请求
            if (this.isloading) {
                return
            }
            // 让页码值自增 +1
            this.queryObj.pagenum += 1
            // 重新获取列表数据
            this.getGoodsList()
        },
        onPullDownRefresh() {
            // 1. 重置关键数据
            this.queryObj.pagenum = 1
            this.total = 0
            this.isloading = false
            this.goodsList = []

            // 2. 重新发起请求
            this.getGoodsList(() => uni.stopPullDownRefresh())
        },
        methods: {
            // 获取商品列表数据的方法
            async getGoodsList(callback) {
                // ** 打开节流阀
                this.isloading = true
                // 发起请求
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
                // ** 关闭节流阀
                this.isloading = false
                callback && callback()
                if (res.meta.status !== 200) return uni.$showMsg()

                // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
                this.goodsList = [...this.goodsList, ...res.message.goods]
                this.total = res.message.total
            },
            gotoDetail(item) {
                uni.navigateTo({
                    url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
                })
            }
        }
    }
</script>

<style lang="scss">
    .goods-list {
        padding: 5px;

        .goods-item {
            border-bottom: 1px solid #cdcdcd;
            margin: 5px;
            display: flex;
            justify-content: space-between;

            .left-box {
                width: 35%;
                height: 125px;

                image.goods-pic {
                    width: 100%;
                    height: 90%;
                }
            }

            .right-box {
                width: 60%;

                .goods-title {
                    height: 70%;
                    text-align: start;
                    font-size: 13px;
                }

                .goods-price {
                    height: 30%;
                    font-size: 15px;
                    text-align: start;
                    color: #c00000;
                }
            }
        }
    }
</style>
