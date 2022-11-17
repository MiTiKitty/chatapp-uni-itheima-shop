<template>
    <view>
        <view class="search-box">
            <uni-search-bar v-model="kw" @input="input" :radius="100" cancelButton="none" bgColor="#ffffff"
                focus="true">
            </uni-search-bar>
        </view>
        <!-- 搜索建议列表 -->
        <view class="sugg-list">
            <view class="sugg-item" v-for="(item, index) in searchResults" :key="index"
                @click="gotoDetail(item.goods_id)">
                <view class="goods-name">{{item.goods_name}}</view>
                <uni-icons type="arrowright" size="16"></uni-icons>
            </view>
        </view>
        <!-- 搜索历史 -->
        <view class="history-box" v-if="historyShow">
            <!-- 标题区域 -->
            <view class="history-title">
                <text>搜索历史</text>
                <uni-icons type="trash" style="float: right;margin-right: 5px;" size="17" @click="clearHistory">
                </uni-icons>
            </view>
            <!-- 列表区域 -->
            <view class="history-list">
                <uni-tag inverted='true' :text="item" v-for="(item, i) in historys" :key="i" @click="choiceKW(item)">
                </uni-tag>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 定时器
                timer: null,
                // 关键词
                kw: '',
                // 搜索建议列表
                searchResults: [],
                // 搜索历史
                historyList: [],
                historyShow: true
            };
        },
        computed: {
            historys() {
                // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
                // 而是应该新建一个内存无关的数组，再进行 reverse 反转
                return [...this.historyList].reverse()
            }
        },
        onLoad() {
            this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
        },
        methods: {
            input(value) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    // this.kw = value
                    this.historyShow = false
                    this.getSearchResults()
                }, 300)
            },
            async getSearchResults() {
                if (this.kw.trim() === '') {
                    this.searchResults = []
                    this.historyShow = true
                    return
                }
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/qsearch', {
                    query: this.kw
                })
                if (res.meta.status !== 200) return uni.$showMsg()
                this.searchResults = res.message
            },
            gotoDetail(goods_id) {
                this.saveSearchHistory()
                uni.navigateTo({
                    // 指定详情页面的 URL 地址，并传递 goods_id 参数
                    url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
                })
            },
            choiceKW(item) {
                this.kw = item;
                this.historyShow = false
                this.getSearchResults()
            },
            clearHistory() {
                this.historyList = []
                uni.setStorageSync('kw', '[]')
            },
            saveSearchHistory() {
                // this.historyList.push(this.kw)
                // 1. 将 Array 数组转化为 Set 对象
                const set = new Set(this.historyList)
                // 2. 调用 Set 对象的 delete 方法，移除对应的元素
                set.delete(this.kw)
                // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
                set.add(this.kw)
                // 4. 将 Set 对象转化为 Array 数组
                this.historyList = Array.from(set)
                uni.setStorageSync('kw', JSON.stringify(this.historyList))
            }
        },
        destroyed() {
            clearTimeout(this.timer)
        }
    }
</script>

<style lang="scss">
    .search-box {
        position: sticky;
        z-index: 999;
        top: 0;
        background-color: #c00000;
    }

    .sugg-list {
        padding: 0 5px;

        .sugg-item {
            font-size: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #efefef;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .goods-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 3px;
            }
        }
    }

    .history-box {
        margin-top: 5px;
        padding: 2px 5px;

        .history-title {
            font-size: 15px;
            padding-bottom: 4px;
            border-bottom: 1px solid #0d0f0d;

            text {
                font-weight: 700;
            }
        }

        .history-list {
            padding: 3px 2px;

            .uni-tag {
                margin-top: 5px;
                margin-right: 5px;
                border-radius: 7px;
                color: #0a0f03;
            }
        }
    }
</style>
