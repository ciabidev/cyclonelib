import type { Emotion } from "$lib/types/emoticon";

export type DialogButton = {
    text: string,
    color?: "red",
    main: boolean,
    timeout?: number, // milliseconds
    action: () => unknown | Promise<unknown>,
    link?: string
}

export type SmallDialogIcons = "warn-red";

export type DialogPickerItem = {
    type?: "photo" | "video" | "gif",
    url: string,
    thumb?: string,
};

type Dialog = {
    id: string,
    dismissable?: boolean,
};

export type SmallDialog = Dialog & {
    type: "small",
    emoticon?: Emotion,
    icon?: SmallDialogIcons,
    title?: string,
    bodyText?: string,
    bodySubText?: string,
    buttons?: DialogButton[],
    leftAligned?: boolean,
};

export type PickerDialog = Dialog & {
    type: "picker",
    items?: DialogPickerItem[],
    buttons?: DialogButton[],
    onSelect?: (item: DialogPickerItem) => void,
};

export type DialogInfo = SmallDialog | PickerDialog;

