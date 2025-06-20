import React from 'react';
import styled, { useTheme } from 'styled-components';

const Container = styled.div`
  width: 230px;
  height: 194px;
`;

const TerminalToolbar = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: ${({ theme }) => theme.terminal?.toolbarBg};
`;

const Butt = styled.div`
  display: flex;
  align-items: center;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-right: 5px;
  font-size: 8px;
  height: 12px;
  width: 12px;
  box-sizing: border-box;
  border: none;
  border-radius: 100%;
  background: ${({ theme }) => theme.terminal?.btnBg};
  text-shadow: 0px 1px 0px rgba(255,255,255,0.2);
  box-shadow: 0px 0px 1px 0px #41403A, 0px 1px 1px 0px #474642;
  &:focus { outline: none; }
`;

const BtnColor = styled(Btn)`
  background: ${({ theme }) => theme.terminal?.btnColor};
`;

const User = styled.p`
  color: ${({ theme }) => theme.terminal?.userColor};
  margin-left: 6px;
  font-size: 14px;
  line-height: 15px;
`;

const TerminalBody = styled.div`
  background: ${({ theme }) => theme.terminal?.bodyBg};
  height: calc(100% - 30px);
  padding-top: 2px;
  margin-top: -1px;
  font-size: 12px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const TerminalPrompt = styled.div`
  display: flex;
`;

const TerminalSpan = styled.span`
  margin-left: 4px;
`;

const TerminalUser = styled(TerminalSpan)`
  color: ${({ theme }) => theme.terminal?.user};
`;

const TerminalLocation = styled(TerminalSpan)`
  color: ${({ theme }) => theme.terminal?.location};
`;

const TerminalBling = styled(TerminalSpan)`
  color: ${({ theme }) => theme.terminal?.bling};
`;

const TerminalCursor = styled.span`
  display: block;
  height: 14px;
  width: 5px;
  margin-left: 10px;
  background: ${({ theme }) => theme.terminal?.cursor};
  animation: curbl 1200ms linear infinite;
  @keyframes curbl {
    0%, 49%, 100% { background: ${({ theme }) => theme.terminal?.cursor}; }
    60%, 99% { background: transparent; }
  }
`;

interface TerminalProps {}

const Terminal: React.FC<TerminalProps> = () => {
  const theme = useTheme();
  return (
    <Container>
      <TerminalToolbar>
        <Butt>
          <BtnColor />
          <Btn />
          <Btn />
        </Butt>
        <User>johndoe@admin: ~</User>
      </TerminalToolbar>
      <TerminalBody>
        <TerminalPrompt>
          <TerminalUser>johndoe@admin:</TerminalUser>
          <TerminalLocation>~</TerminalLocation>
          <TerminalBling>$</TerminalBling>
          <TerminalCursor />
        </TerminalPrompt>
      </TerminalBody>
    </Container>
  );
};

export default Terminal; 