import { create } from "zustand";
import { UserAPI } from "./users";
import { TokenGenerationError } from "@/utils/error";
import { HttpStatus } from "@/utils/httpStatus";
type ListTitle = "To do" | "In progress" | "Done";
export interface Task {
  id: number;
  content: string;
}
export interface List {
  tasks: Array<Task>;
  title: ListTitle;
}

const DEFAULT_LIST = [
  { tasks: [], title: "To do" },
  { tasks: [], title: "In progress" },
  { tasks: [], title: "Done" },
] as Array<List>;

export const listStore = create<{
  tasknum: number;
  lists: Array<List>;
  setTaskNum: (num: number) => void;
  resetLists: () => void;
  setLists: (newList: Array<List>) => void;
}>((set) => ({
  tasknum: 0,
  setTaskNum: (num: number) => set(() => ({ tasknum: num })),
  lists: DEFAULT_LIST,
  resetLists: () => set(() => ({ lists: DEFAULT_LIST })),
  setLists: (newList: Array<List>) => set(() => ({ lists: newList })),
}));

export class ListAPI {
  static async UpdateTasksDB(lists: any, userId: number) {
    try {
      const token = await UserAPI.generateAccessToken();
      if (!token) throw new TokenGenerationError();

      const { status } = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lists),
      });

      if (status == HttpStatus.OK) {
        console.log("Update Successfully!");
        return;
      }

      throw new Error("Failed");
    } catch (err) {
      console.log(err);
      if (err instanceof TokenGenerationError) {
        UserAPI.logOut();
      }
    }
  }
  static async getTasks(id: number) {
    try {
      const token = await UserAPI.generateAccessToken();
      if (!token) throw new TokenGenerationError();

      const res = await fetch(`/api/profile/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status == 401) {
        UserAPI.logOut();
      }

      const { lists, taskNum } = await res.json();

      const { setTaskNum, setLists } = listStore.getState();
      setTaskNum(taskNum);
      const validJsonString = lists.replace(/^'|'$/g, "");
      setLists(JSON.parse(validJsonString));
    } catch (err) {
      console.log(err);
      if (err instanceof TokenGenerationError) {
        UserAPI.logOut();
      }
    }
  }
}
