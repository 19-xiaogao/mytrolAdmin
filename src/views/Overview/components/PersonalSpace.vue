<template>
    <div class="person-space">
        <div class="title">
            <h4>个人空间</h4>
            <!-- <span>编辑个人资料</span> -->
        </div>
        <div class="avator-message">
            <div class="avator">
                <img :src="personMessage.avatar" alt="" />
                <img alt="" src="@assets/images/card.png" />
            </div>
            <div class="message">
                <h4 class="two-line-txt">{{ personMessage.nickname }}</h4>
                <span>{{ currentRole }}</span>
            </div>
        </div>
        <div class="indicators">
            <div>
                <span><em>-</em></span>
                <span>昨日审核</span>
            </div>
            <div>
                <span><em>-</em></span>
                <span>待我审核</span>
            </div>
            <div>
                <span><em>-</em></span>
                <span>已审核</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();
        const personMessage = computed(() => store.getters.getPersonMessage);
        const currentRole = computed(() => {
            const user = store.getters.getUser;
            if (user.role === "admin") {
                return "超级管理员";
            } else if (user.role === "maker") {
                return "创作者";
            } else {
                return "运营";
            }
        });
        // const
        return { personMessage, currentRole };
    },
};
</script>

<style lang="scss" scoped>
.person-space {
    width: 40%;
    height: 298px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(182, 182, 182, 0.13);
    border-radius: 8px;
    border: 0px solid rgba(213, 213, 213, 0.58);
    padding: 20px 30px;
    box-sizing: border-box;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
            font-size: 20px;
        }

        span {
            font-size: 14px;
            font-weight: 500;
            color: #adadad;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
                // color: #c20c0c;
            }
        }
    }

    .avator-message {
        display: flex;
        margin-top: 28px;

        .avator {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            overflow: hidden;
            position: relative;

            img:nth-child(1) {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                object-fit: cover;
                object-position: center center;
            }

            img:nth-child(2) {
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }

        .message {
            margin-left: 5px;
            text-align: left;
            flex: 1;

            h4 {
                font-size: 22px;
                font-weight: 500;
                color: #4c4668;
            }

            span {
                font-size: 16px;
                font-weight: 400;
                color: #4c4668;
            }
        }
    }

    .indicators {
        margin-top: 29px;
        display: flex;
        justify-content: space-between;

        div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 96px;
            height: 96px;
            text-align: center;
            cursor: pointer;

            span {
                font-weight: 500;
                color: #000000;
            }

            span:nth-child(1) {
                font-size: 34px;
            }

            span:nth-child(2) {
                font-size: 14px;
            }

            &:hover {
                background: #f1f1f1;
                border-radius: 8px;
            }
        }
    }
}
</style>
