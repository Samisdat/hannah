import { readdir, readFile } from "fs/promises";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { resolve } from "path";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

type HorsesList = {
  mdxSources?: MDXRemoteSerializeResult[];
  paginate: number;
};

import Image from "../components/Image";

const components = { Image };

export const getStaticProps = (async (context) => {
  const path = resolve(process.cwd(), "src", "markdown");

  const files = await readdir(path);

  const mdxSources = await Promise.all(
    files.map(async (file) => {
      const testFile = await readFile(resolve(path, file), "utf8");

      const mdxSource = await serialize(testFile, { parseFrontmatter: true });
      return mdxSource;
    }),
  );

  const horsesList: HorsesList = {
    mdxSources,
    paginate: 0,
  };

  return { props: { horsesList } };
}) satisfies GetStaticProps<{
  horsesList: HorsesList;
}>;

export default function Page({
  horsesList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(horsesList);

  const horses = horsesList.mdxSources?.map((mdxSource) => {
    return (
      <MDXRemote
        key={mdxSource.frontmatter.title}
        {...mdxSource}
        components={components}
      />
    );
  });

  return (
    <>
      {horsesList.paginate}
      {horses}
      {/*<MDXRemote {...horsesList.mdxSources[0]} components={components} /> */}
    </>
  );
}
