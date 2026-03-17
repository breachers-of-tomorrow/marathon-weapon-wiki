import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  submissionImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
