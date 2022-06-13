<template>
    <ul class="sidebar">
        <router-link v-for="item in menus" :key="item.id" :to="item.path">
            <li>
                <p :class="isOpacity(item.path)"></p>
                <div class="icons">
                    <icon-svg :icon="item.icon" :style="isColor(item.path)" class="icon"></icon-svg>
                    <span :style="isColor(item.path)">{{ item.text }}</span>
                </div>
            </li>
        </router-link>
    </ul>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute } from "vue-router";

const adminMenu = [
    {
        icon: "icon-icon2-hover1",
        text: "总揽",
        id: 1,
        path: "/overview"
    },
    {
        icon: "icon-a-bianzu4",
        text: "审核",
        path: "/audit",
        id: 3
    },
    {
        icon: "icon-a-bianzu311",
        text: "新增",
        path: "/setting",
        id: 7
    },

    {
        icon: "icon-a-bianzu32",
        text: "运营",
        path: "/operation",
        id: 5
    },
    {
        icon: "icon-icon3",
        text: "创作",
        path: "/shelves",
        id: 4
    },
    {
        icon: "icon-icon3",
        text: "盲盒",
        path: "/bindBox",
        id: 11
    },
    {
        icon: "icon-a-bianzu3",
        text: "作品",
        path: "/items",
        id: 6
    },
    {
        icon: "icon-a-bianzu4",
        text: "订单",
        path: "/record",
        id: 2
    },
    {
        icon: "icon-a-bianzu4",
        text: "查询",
        path: "/query",
        id: 8
    },
    {
        icon: "icon-a-bianzu8",
        text: "白名单",
        path: "/whitelist",
        id: 9
    },
    {
        icon: "icon-tui",
        text: "退款",
        path: "/refund",
        id: 10
    }
];
const makeMenu = [
    {
        icon: "icon-icon2-hover1",
        text: "总揽",
        id: 1,
        path: "/overview"
    },
    {
        icon: "icon-icon3",
        text: "创作",
        path: "/shelves",
        id: 4
    },
    {
        icon: "icon-a-bianzu3",
        text: "作品",
        path: "/items",
        id: 6
    }
];
const operationMenu = [
    {
        icon: "icon-icon2-hover1",
        text: "总揽",
        id: 1,
        path: "/overview"
    },
    {
        icon: "icon-icon3",
        text: "创作",
        path: "/shelves",
        id: 4
    },
    {
        icon: "icon-a-bianzu32",
        text: "运营",
        path: "/operation",
        id: 5
    },
    {
        icon: "icon-a-bianzu3",
        text: "作品",
        path: "/items",
        id: 6
    }
];
export default {
    setup() {
        const route = useRoute();
        const store = useStore();
        const currentPath = computed(() => route.path);
        const user = computed(() => store.getters.getUser);
        const menus = computed(() => {
            if (user.value.role === "admin") {
                return adminMenu;
            } else if (user.value.role === "maker") {
                return makeMenu;
            } else {
                return operationMenu;
            }
        });
        const isOpacity = computed(() => (path) => path === currentPath.value ? "" : "opacity");
        const isColor = computed(() => (path) => path === currentPath.value ? "color:#ED6637" : "");
        return { menus, isOpacity, isColor };
    }
};
</script>

<style lang="scss" scoped>
.sidebar {
    height: 100vh;
    width: 60px;
    background: var(--white);
    box-shadow: 4px 0px 8px 0px rgba(156, 156, 156, 0);
    overflow: hidden;
    padding-top: 80px;

    li {
        height: 60px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;

        .icons {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;

            .icon {
                font-size: 2rem;
                color: #adadad;
            }

            span {
                font-size: 12px;
                font-weight: 500;
                color: #adadad;
            }
        }

        p {
            width: 4px;
            height: 60px;
            border-radius: 10px;
            margin-right: 10px;
            background: linear-gradient(360deg, #ff451d 0%, #ffca2a 100%);
        }
    }
}

.gradient {
    color: #ffca2a;
}

.opacity {
    opacity: 0;
}
</style>
