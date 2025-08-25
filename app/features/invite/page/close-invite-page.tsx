import { closeInvitation } from "../mutations";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/close-invite-page";
import { getLoggedInUserId } from "~/features/auth/queries";
import { getInvitationByToken } from "../queries";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { token } = params;
  const userId = await getLoggedInUserId(client);
  const invitation = await getInvitationByToken(client, token);

  if (invitation.inviter_id !== userId) {
    return {
      error: "You are not the owner of this invitation",
      success: false,
    };
  }

  const { success } = await closeInvitation(client, token);

  if (!success) {
    return { error: "Failed to close invitation", success: false };
  }

  return { success: true, message: "초대 마감 완료" };
};
