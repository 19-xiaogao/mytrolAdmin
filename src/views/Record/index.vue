<template>
    <div class="order page-height">
        <div class="header">
            <div class="switch-table">
                <h4 :class="renderCurrentActive(0)" @click="handleSwitchTableClick(0)">全部订单</h4>
                <h4 :class="renderCurrentActive(1)" @click="handleSwitchTableClick(1)">作品订单分类</h4>
            </div>
            <!-- <div class="search-box">
                <div class="dropdown">
                    <div class="current-option">
                        <a-dropdown class="text">
                            <template #overlay></template>
                            <a-button>
                                <span class="span">状态</span>
                                <div class="icon"></div>
                            </a-button>
                        </a-dropdown>
                    </div>
                </div>
                <div class="search">
                    <span class="line"></span>
                    <input class="input" type="text" />
                    <span class="icon">
                        <img alt="" src="@assets/images/search.png" />
                    </span>
                </div>
            </div> -->
        </div>
        <Order v-show="currentTableIndex === 0" @showOrderDetailComponent="handleShowOrderDetailComponent" />
        <ShareRecord v-show="currentTableIndex === 1" />
        <OrderDetail v-if="isOrderShow" :orderItem="currentOrderItem" @close="handleOrderDetailClick" />
    </div>
</template>

<script>
import OrderDetail from "./OrderDetail";
import Order from "./Order";
import ShareRecord from "./ShareRecord";
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "record",
    components: {
        OrderDetail,
        Order,
        ShareRecord,
    },
    setup() {
        const currentTableIndex = ref(0);
        const isOrderShow = ref(false);
        const currentOrderItem = ref({});

        const handleOrderDetailClick = () => {
            isOrderShow.value = !isOrderShow.value;
        };
        onMounted(() => {});
        const renderCurrentActive = computed(
            () => (index) => index === currentTableIndex.value ? "active" : ""
        );
        const handleSwitchTableClick = (index) => (currentTableIndex.value = index);

        const handleShowOrderDetailComponent = (item) => {
            isOrderShow.value = true;
            currentOrderItem.value = item;
        };
        return {
            handleOrderDetailClick,
            isOrderShow,
            renderCurrentActive,
            handleSwitchTableClick,
            currentTableIndex,
            currentOrderItem,
            handleShowOrderDetailComponent,
        };
    },
});
</script>

<style lang="scss" scoped>
.order {
    border-radius: 8px;
    padding-top: 31px;
    padding-left: 44px;
    padding-right: 36px;
    box-sizing: border-box;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .search-box {
            width: 301px;
            height: 40px;
            background: #f1f1f1;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .dropdown {
                width: 20%;

                .current-option {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .text {
                        font-size: 14px;
                        font-weight: 400;
                        color: #000000;
                        margin: 0 10px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: #f1f1f1;
                        border: none;
                        box-sizing: border-box;
                    }

                    .icon {
                        cursor: pointer;
                        width: 6px;
                        height: 6px;
                        border: 1px solid #151515;
                        border-left-color: transparent;
                        border-top-color: transparent;
                        transition: all 0.3s;
                        transform: translate(10px, -3px) rotate(45deg);
                    }
                }
            }

            .search {
                flex: 1;
                text-align: left;
                padding-left: 4px;
                display: flex;
                align-items: center;

                .line {
                    display: inline-block;
                    width: 1px;
                    height: 16px;
                    background: #d8d8d8;
                    border-radius: 1px;
                    border: 1px solid #c7c7c7;
                }

                .input {
                    margin-left: 5px;
                    width: 80%;
                }

                .icon {
                    cursor: pointer;
                }
            }
        }

        .switch-table {
            display: flex;
            justify-content: space-between;

            h4 {
                font-size: 16px;
                font-weight: 500;
                color: #7e7e7e;
                // width: 70px;
                height: 100%;
                text-align: center;
                margin: 0;
                padding: 0;
                margin-right: 40px;
                cursor: pointer;
            }

            .active {
                font-weight: 500;
                border-bottom: 2px solid #ff451d;
                color: #151515;
            }
        }
    }
}

.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>
