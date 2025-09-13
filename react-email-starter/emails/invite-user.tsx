import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Link,
  Heading,
  Tailwind,
  Preview,
} from "@react-email/components";

interface MoaInvitationEmailProps {
  accountName: string;
  invitedByUsername?: string;
  verificationCode: string;
  invitationLink: string;
}

export default function MoaInvitationEmail({
  accountName,
  invitedByUsername,
  verificationCode,
  invitationLink,
}: MoaInvitationEmailProps) {
  return (
    <Html lang="ko">
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Preview>[MOA] {accountName} 가계부 초대</Preview>
          <Container className="bg-white p-5 rounded-lg shadow-md my-16 mx-auto max-w-xl">
            <Heading
              as="h1"
              className="text-2xl font-bold text-gray-800 text-center my-8"
            >
              [MOA] {accountName} 가계부 초대
            </Heading>
            <Text className="text-gray-600 leading-6 px-10">안녕하세요!</Text>
            <Text className="text-gray-600 leading-6 px-10">
              {invitedByUsername && (
                <>
                  <strong className="text-bold">{invitedByUsername}</strong>
                  님의{" "}
                </>
              )}
              <strong className="text-bold">{accountName}</strong> 가계부
              계정으로 초대받았습니다. 아래 버튼을 클릭하여 가입하거나 로그인한
              후, 초대를 수락해 주세요.
            </Text>
            <Button
              href={invitationLink}
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-base block mx-auto my-6 w-fit"
            >
              초대 수락하기
            </Button>
            <Text className="text-gray-600 leading-6 px-10">
              초대 코드는 다음과 같습니다:
            </Text>
            <Text className="bg-gray-200 text-gray-800 font-bold tracking-widest text-lg py-2 px-4 rounded-md mx-auto my-4 w-fit">
              {verificationCode}
            </Text>
            <Text className="text-gray-600 leading-6 px-10">
              <strong className="text-bold text-blue-600">초대 수락하기</strong>{" "}
              버튼이 작동하지 않는다면, 아래 링크를 복사하여 브라우저에 붙여넣어
              주세요.
            </Text>
            <Link
              href={invitationLink}
              className="text-sm text-blue-600 underline px-10 break-all"
            >
              {invitationLink}
            </Link>
            <Text className="text-gray-400 text-sm mt-10 px-10">
              MOA 팀 드림
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
