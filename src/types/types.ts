export type toggleType = {
  toggleUI: boolean
}

export interface RadioObject {
  id?: number,
  title: string,
  url: string,
  genre: string,
  image: string,
}

export interface ToggleUIProps {
  toggleUI: boolean;
}

export interface ButtonType {
  className: string;
  action: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  type?: 'submit' | 'button' | 'reset';
  ariaLabel?: string;
  disabled?: boolean;
}

export type SettingsProps = {
  toggleUI: () => void
}
export interface PlayerProps {
  list: RadioItem[];
  toggleUI: boolean;
}
export interface RadioItem {
  id: string | number;
  title: string;
  url: string;
  artist?: string;
  genre?: string;
  image: string;
}
