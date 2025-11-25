/**
 * CustomIconButton
 * Props:
 * - onClick: function called when the button is clicked.
 * - children: optional ReactNode; if provided and not forced, it will render as the icon/content.
 * - disabled: boolean; disables the button when true. Default: false.
 * - type: semantic action name used to resolve color and default icon (e.g., "Delete", "Edit", "Details", "Preview", etc.).
 * - typeMap: object mapping { [typeName]: muiPaletteKeyOrColorString } to override DEFAULT_TYPE_MAP.
 * - iconMap: object mapping { [typeName]: ReactIconComponent } to add/override default icons.
 * - tone: MUI palette key ("primary" | "secondary" | "error" | etc.) to force color from theme.
 * - color: explicit CSS color string to use if provided (overrides type-based color).
 * - hoverAlpha: number (0..1) used for hover background alpha. Default: 0.12.
 * - typeCase: "lower" | "upper" | any; normalizes keys for `type`, `typeMap`, `iconMap`. Default: "lower".
 * - forceTypeIcon: boolean; when true, renders the icon from `iconMap` for `type` even if `children` exist. Also auto-forced for Delete/Edit/Details. Default: false.
 * - iconSize: number; size passed to the mapped icon component. Default: 22.
 * - ...props: any other MUI IconButton props (e.g., size, aria-label).
 *
 * Color resolution order:
 *   tone → color → theme.palette[typeMap[type]].main → raw typeMap[type] (as color string) → child color → theme.palette.text.primary
 */

"use client";

import React from "react";
import { IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import { Eye } from "lucide-react";

const DEFAULT_TYPE_MAP = {
  Preview: "info",
  Details: "primary",
  Edit: "warning",
  Create: "success",
  Delete: "error",
  Copy: "secondary",
  Share: "info",
  Print: "#4b5563",
  Disburse: "success",
  Send: "primary",
  Retry: "warning",
  Close: "#FF0000",
};

const DEFAULT_ICON_MAP = {
  Delete: MdDeleteOutline,
  Edit: FiEdit,
  Details: Eye,
};

const normalizeKey = (k: string, mode: string) => {
  const s = String(k || "");
  if (mode === "lower") return s.toLowerCase();
  if (mode === "upper") return s.toUpperCase();
  return s;
};

const normalizeKeys = (
  obj: Record<string, any>,
  mode: string
) =>
  Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [normalizeKey(k, mode), v])
  );

import { IconButtonProps } from "@mui/material";

interface CustomIconButtonProps extends Omit<IconButtonProps, "color" | "type"> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
  actionType?: string;
  typeMap?: Record<string, string>;
  iconMap?: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>;
  tone?: string;
  color?: string;
  hoverAlpha?: number;
  typeCase?: "lower" | "upper" | string;
  forceTypeIcon?: boolean;
  iconSize?: number;
}

// Helper function to validate if a value is a valid color for the alpha() function
const isValidColorForAlpha = (value: any): boolean => {
  if (!value || typeof value !== "string") return false;
  // Check for hex, rgb, rgba, hsl, hsla, or color()
  return /^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|color\()/.test(value);
};


export default function CustomIconButton({
  onClick,
  children,
  disabled = false,
  actionType,
  typeMap = {},
  iconMap = {},
  tone,
  color,
  hoverAlpha = 0.12,
  typeCase = "lower",
  forceTypeIcon = false,
  iconSize = 22,
  ...props
}: CustomIconButtonProps) {
  const mergedTypeMap = {
    ...normalizeKeys(DEFAULT_TYPE_MAP, typeCase),
    ...normalizeKeys(typeMap, typeCase),
  };
  const mergedIconMap = {
    ...normalizeKeys(DEFAULT_ICON_MAP, typeCase),
    ...normalizeKeys(iconMap, typeCase),
  };

  const typeKey = normalizeKey(actionType ?? "", typeCase);
  const mapVal = mergedTypeMap[typeKey];

  const childColor =
    React.isValidElement(children) && children.props
      ? ((children.props as { color?: string; style?: React.CSSProperties }).color ||
         (children.props as { style?: React.CSSProperties }).style?.color)
      : null;

  const getTypeIconEl = () => {
    const IconComp = mergedIconMap[typeKey];
    if (!IconComp) return null;
    return <IconComp size={iconSize} style={{ color: "currentColor" }} />;
  };

  const shouldForceTypeIcon =
    forceTypeIcon ||
    ["delete", "edit", "details"].includes(String(actionType || "").toLowerCase());

  const finalChild =
    shouldForceTypeIcon || !children
      ? getTypeIconEl() ?? children
      : React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<any>,
          {
            ...((children as React.ReactElement<any>).props || {}),
            style: {
              ...((children as React.ReactElement<any>).props?.style || {}),
              color: "currentColor",
            },
            color: undefined,
          }
        )
      : children;

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={(theme) => {
        const isPaletteKey =
          typeof mapVal === "string" &&
          theme.palette &&
          Object.prototype.hasOwnProperty.call(theme.palette, mapVal) &&
          typeof (theme.palette as any)[mapVal]?.main === "string";

        const fromTypeTone =
          isPaletteKey ? (theme.palette as any)[mapVal].main : null;
        const resolvedColor =
          (
            tone &&
            theme.palette &&
            Object.prototype.hasOwnProperty.call(theme.palette, tone) &&
            (theme.palette as Record<string, any>)[tone]?.main
          ) ||
          color ||
          fromTypeTone ||
          (mapVal && !fromTypeTone ? mapVal : null) ||
          childColor ||
          theme.palette.text.primary;

		      // Ensure resolvedColor is a valid color format for the alpha() function
        const validColor = isValidColorForAlpha(resolvedColor)
          ? resolvedColor
          : theme.palette.text.primary;


        return {
          color: resolvedColor,
          "&:hover": {
            backgroundColor: alpha(validColor, hoverAlpha),
          },
          "&.Mui-disabled": { color: alpha(validColor, 0.4) },
          "& .MuiTouchRipple-child": {
            backgroundColor: "currentColor",
          },
          "&:focus-visible": {
            boxShadow: `0 0 0 3px ${alpha(validColor, 0.24)}`,
          },
        };
      }}
      {...props}
    >
      {finalChild}
    </IconButton>
  );
}
