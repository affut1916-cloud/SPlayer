import type { ComputedRef, InjectionKey } from "vue";

/**
 * 播放器控制区弹层状态
 *
 * 控制栏内的 Popover/Dropdown 弹层会被 teleport 到 body，
 * 鼠标移入弹层时会离开控制栏，导致自动隐藏逻辑误判并隐藏控制栏，
 * 进而使锚点元素尺寸归零、弹层闪现到左上角。
 * 这里统一收集弹层打开状态，供自动隐藏逻辑判断。
 */
interface PlayerControlAreaContext {
  /** 是否有弹层处于打开状态 */
  hasActivePopover: ComputedRef<boolean>;
  /** 上报弹层打开/关闭状态 */
  setPopoverShow: (key: symbol, show: boolean) => void;
}

const playerControlAreaKey: InjectionKey<PlayerControlAreaContext> = Symbol("playerControlArea");

/**
 * 提供播放器控制区弹层状态
 */
export const providePlayerControlArea = () => {
  const activePopovers = reactive(new Set<symbol>());

  const setPopoverShow = (key: symbol, show: boolean) => {
    if (show) {
      activePopovers.add(key);
    } else {
      activePopovers.delete(key);
    }
  };

  const hasActivePopover = computed(() => activePopovers.size > 0);

  provide(playerControlAreaKey, { hasActivePopover, setPopoverShow });

  return { hasActivePopover };
};

/**
 * 获取播放器控制区弹层状态（非播放器环境下返回 null）
 */
export const usePlayerControlArea = () => inject(playerControlAreaKey, null);
