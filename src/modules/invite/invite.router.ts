import { Router } from "medusa-extender";
import acceptInvite from "./acceptInvite.controller";

@Router({
  routes: [
    {
      requiredAuth: false,
      path: "/admin/invites/accept",
      method: "post",
      handlers: [acceptInvite],
    },
  ],
})
export class AcceptInviteRouter {}
