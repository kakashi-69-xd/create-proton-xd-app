import { panic,ARGS,templateRepo,denoJsonc,config,HELP,root } from "./env.ts";
import prompts from "npm:prompts";
import { rgb24 } from "https://deno.land/std@0.188.0/fmt/colors.ts";
import sgw from "npm:@powercord/simple-git-wasm";



export default class Api {
  private args: Map<string,string>=new Map();
  private path: string="my-app";
  private name: string="my-app";
  
  constructor() {//done
    let argv=Deno.args;
    if(argv.includes("--help")) help();
    
    
    this.path=argv.length<1?"my-app":argv[0]!;
    
    this.name=parseName(this.path);

    this.parseArgs(argv);
    
  }
  
  public async setName() {
    const argv=Deno.args;
    if(argv.length>=1&&!argv[0].startsWith("-")) return;
    
    this.path=(await prompts({
      type: "text",
      name: "value",
      message: "Name of the Project",
      initial: "my-app"
    })).value;
    this.name=parseName(this.path);
  }


  public async createApp() {//done
    await Deno.mkdir(this.path,{
      recursive: true
    }).catch((err)=> {
      panic(`failed: ${err}`);
    });
    
    Deno.chdir(this.path);
    
    await this.createEnv(templateRepo(`${await this.confirmExtention()}/${(await this.confirmTemplate()).toLowerCase()}`));


    await Deno.writeTextFile("deno.jsonc",denoJsonc(this.name)).catch((err)=> {
      panic(`failed due to ${err}`);
    });
    
    Deno.chdir(`${this.path}/proton-xd`);
    
    
    await this.addProtonXD();
    
    Deno.writeTextFile("config.json",config(this.name,this.args));
  }
  

  private async confirmTemplate(): Promise<string> {
    return this.args.get("--template")??(await prompts([{
      type: "select",
      name: "value",
      message: "Select a Language",
      choices: [
        {title: rgb24("Aleph",0xff3369),value: "aleph"},
        {title: rgb24("Fresh",0xffec51),value: "fresh"},
        {title: rgb24("Next",0x1277ed),value: "next"},
        {title: rgb24("Nuxt",0x41f883),value: "nuxt"},
        {title: rgb24("React",0x00d8ff),value: "react"},
        {title: rgb24("Remix",0x8febe8),value: "remix"},
        {title: rgb24("Ruck",0xffffff),value: "ruck"},
        {title: rgb24("Svelt",0xfa3e00),value: "svelt"},
        {title: rgb24("Vanilla",0xffff00),value: "vanilla"},
        {title: rgb24("Vue",0x41f883),value: "vue"},
      ],
      initial: 0
    }])).value;
  }

  private createEnv=async (url: string)=> sgw.clone(url,debugPath(Deno.realPathSync("./")));

  private async addProtonXD() {
    let ext: "js"|"ts"="ts";
    for(const entity of Deno.readDirSync("../")) {
      if(!entity.name.endsWith(".js")) continue;
      else if(!entity.name.endsWith(".ts")) break;
      ext="js";
      break;
    }
    await sgw.clone(root(ext),debugPath(Deno.realPathSync("./")));
  }

  private confirmExtention=async ()=>this.args.get("--ext")??(await prompts([
    {
      type: "select",
      name: "value",
      message: "Select a Language",
      choices: [
        { title: rgb24("TypeScript",0x2e78c8), value: "ts"},
        { title: rgb24("JavaScript",0xf0db4f), value: "js"},
      ],
      initial: 0
    }
  ])).value;
  

  private parseArgs(argv: string[]) {//done
    for(let i=1;i<argv.length;i+=2) {
      const k=argv[i]!,v=argv[i+1]!;
      if(!ARGS.includes(k)) continue;
      this.args.set(k,v);
    }
  }
}



const parseName=(path: string)=> path.split(/[/,\\]/g).pop()!;

const debugPath=(path: string)=> path.replaceAll(/\\/g,"/");

const help=()=> {
  console.log(HELP);
  Deno.exit(0);
};
