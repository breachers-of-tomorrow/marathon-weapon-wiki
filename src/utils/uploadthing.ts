import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { UploadRouter } from "@/server/uploadthing";

export const { useUploadThing } = generateReactHelpers<UploadRouter>();

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();
