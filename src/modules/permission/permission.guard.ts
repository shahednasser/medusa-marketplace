import UserService from "../user/user.service";
import _ from "lodash";

export default (permissions: Record<string, unknown>[]) => {
  return async (req, res, next) => {
    const userService = req.scope.resolve("userService") as UserService;
    const loggedInUser = await userService.retrieve(req.user.userId, {
      select: ["id", "store_id"],
      relations: ["teamRole", "teamRole.permissions"],
    });

    const isAllowed = permissions.every((permission) =>
      loggedInUser.teamRole?.permissions.some((userPermission) =>
        _.isEqual(userPermission.metadata, permission)
      )
    );

    if (isAllowed) {
      return next();
    }

    //permission denied
    res.sendStatus(401);
  };
};
