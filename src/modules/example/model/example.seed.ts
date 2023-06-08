import { ExampleStatusTypes } from "./example.entity.js";

export const exampleSeeds = [
  {
    name: "Example Name 1",
    firstName: "Example",
    lastName: "Name 1",
    status: ExampleStatusTypes.Active,
    createdAt: new Date(),
  },
  {
    name: "Example Name 2",
    firstName: "Example",
    lastName: "Name 2",
    status: ExampleStatusTypes.Active,
    createdAt: new Date(),
  },
  {
    name: "Example Name 3",
    firstName: "Example",
    lastName: "Name 3",
    status: ExampleStatusTypes.Active,
    createdAt: new Date(),
  },
];
