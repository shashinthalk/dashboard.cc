import styled from 'styled-components';

export const StyledCodeEditor = styled.div`
  background-color: #0d1117;
  color: #dcdcdc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", monospace;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 5px;
  padding: 15px;
  overflow: auto;
  flex: 1;
  min-height: 150px;
  border: 1px solid #333;
  width: 100%;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }

  & pre code {
    white-space: pre-wrap;
    display: block;
  }

  @media (max-width: 768px) {
    min-height: 120px;
    padding: 10px;
    flex: unset;
    width: 100%;
    box-sizing: border-box;
  }
`; 