import { z } from "zod";
import type { Route } from "./+types/invite-member";
import { createInvitation } from "~/features/invite/mutations";
import { makeSSRClient } from "~/supa-client";
import {
  getLoggedInUserId,
  getProfile,
  getProfileIdByEmail,
} from "~/features/auth/queries";
import { sendEmail } from "~/lib/email";
import { getAccount } from "~/features/manage/queries";
import { getAccountByIdAndProfileId } from "~/features/account/queries";

const schema = z.object({
  email: z.string().email(),
  accountId: z.string().uuid(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const profile = await getProfile(client, userId);
  const formData = await request.formData();
  const { success, data, error } = schema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { error: error.message };
  }

  const account = await getAccount(client, data.accountId);
  if (!account) {
    return { error: "Account not found" };
  }

  const profileId = await getProfileIdByEmail(client, data.email);

  if (profileId) {
    const accountMember = await getAccountByIdAndProfileId(
      client,
      data.accountId,
      profileId
    );
    if (accountMember) {
      return { success: false, message: "이미 가계부 멤버입니다." };
    }
  }

  const inviteData = await createInvitation(client, {
    accountId: data.accountId,
    email: data.email,
    userId,
  });

  if (!inviteData) {
    return { error: "Failed to invite member" };
  }

  const { success: emailSuccess, message: emailMessage } = await sendEmail({
    from: profile?.name
      ? `${profile?.name} via MOA <notify@mail.the-moa.top>`
      : "noreply@mail.the-moa.top",
    to: data.email,
    subject: `[MOA] ${account.name} 가계부 초대`,
    html: `<p>You are invited to join the ${account.name} account</p>
    <a href="http://localhost:5173/verify/${inviteData.token}?email=${data.email}">
    click here to join the account
    </a>`,
  });

  return { success: true, message: "초대 완료" };
};
