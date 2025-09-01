export type DialogButton = {
    text: string,
    color?: "red",
    main: boolean,
    timeout?: number, // milliseconds
    action: () => unknown | Promise<unknown>,
    link?: string
}

export type SmallDialogIcons = "warn-red";

type Dialog = {
    id: string,
    dismissable?: boolean,
};

export type SmallDialog = Dialog & {
    type: "small",
    meowbalt?: string,
    icon?: SmallDialogIcons,
    title?: string,
    bodyText?: string,
    bodySubText?: string,
    buttons?: DialogButton[],
    leftAligned?: boolean,
};

export type DialogInfo = SmallDialog;