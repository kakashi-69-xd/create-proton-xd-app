export const panic=(msg?: string): never=> {
  console.error(msg);
  throw new Error(msg);
}
export const todo=(): never=> {
  throw new Error("not implemented");
};


const HELP: string=todo();
const TEMPLATES=["next","react","vue","vanilla","remix","ruck","svelt","aleph","fresh","nuxt"];
const ARGS=["--template","--backend","--frontend","--build","--ext"];

const root=(ext: string)=> `https://github.com/kakashi-69-xd/proton-xd-env/${ext}.git`;



export const templateRepo=(template: string): string=> `https://github.com/kakashi-69-xd/templates/${template}.git`;

const libPath=()=> `./proton_xd/bin/${Deno.build.os}/proton_xd`;

export function denoJsonc(name: string) {
  const path=libPath();
  return `{
  "tasks": {
    "build": "${path} build ${name}",
    "dev": "${path} dev ${name}",
    "clean": "${path} clean ${name}"
  }
}`;
}

export function config(name: string,args: Map<string,string>) {
  return `{
    "name": "${name}",
    "framework": "${args.get("--template")}",
    "ext": "ts",
    "scripts": {
      "frontend": ${args.get("--frontend")},
      "backend": ${args.get("--backend")},
      "build": ${args.get("--build")}
    },
    "permissions": {
      "read":  ["./","./public/","./src/"],
      "write": ["./"],
      "net": false,
      "run": true,
      "env": false,
      "sys": false,
      "hrtime": false,
      "ffi": false
    }
  }`;
}


export {
  HELP,
  ARGS,
  TEMPLATES,
  root
};