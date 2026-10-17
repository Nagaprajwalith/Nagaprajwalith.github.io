// Devicon logos, bundled locally by Vite
import python from 'devicon/icons/python/python-original.svg'
import java from 'devicon/icons/java/java-original.svg'
import javascript from 'devicon/icons/javascript/javascript-original.svg'
import html from 'devicon/icons/html5/html5-original.svg'
import css from 'devicon/icons/css3/css3-original.svg'
import bootstrap from 'devicon/icons/bootstrap/bootstrap-original.svg'
import git from 'devicon/icons/git/git-original.svg'
import github from 'devicon/icons/github/github-original.svg'
import aws from 'devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'
import flask from 'devicon/icons/flask/flask-original.svg'
import pandas from 'devicon/icons/pandas/pandas-original.svg'
import numpy from 'devicon/icons/numpy/numpy-original.svg'
import scikitlearn from 'devicon/icons/scikitlearn/scikitlearn-original.svg'
import jupyter from 'devicon/icons/jupyter/jupyter-original.svg'
import vscode from 'devicon/icons/vscode/vscode-original.svg'
import plotly from 'devicon/icons/plotly/plotly-original.svg'
import azure from 'devicon/icons/azure/azure-original.svg'
import spark from 'devicon/icons/apachespark/apachespark-original.svg'
import bash from 'devicon/icons/bash/bash-original.svg'
import llm from '@/assets/icons/llm.svg'
import mysql from 'devicon/icons/mysql/mysql-original.svg'
import { siClaude, siDatabricks, siGithubcopilot, siN8n, siTeradata, type SimpleIcon } from 'simple-icons'

// Simple Icons ships bare paths; wrap one in its brand colour as an <img>-ready data URI
const si = (i: SimpleIcon) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${i.hex}"><path d="${i.path}"/></svg>`)}`
import blockchain from '@/assets/icons/blockchain.svg'
import smartcontract from '@/assets/icons/smartcontract.svg'

// `invert` marks black logos that need flipping to stay visible on the dark theme;
// `brighten` lifts dark-coloured logos on dark backgrounds
export const TECH: Record<string, { name: string; src: string; invert?: boolean; brighten?: boolean }> = {
  python: { name: 'Python', src: python },
  spark: { name: 'PySpark', src: spark },
  azure: { name: 'Azure', src: azure },
  databricks: { name: 'Databricks', src: si(siDatabricks) },
  teradata: { name: 'Teradata', src: si(siTeradata) },
  java: { name: 'Java', src: java },
  javascript: { name: 'JavaScript', src: javascript },
  html: { name: 'HTML', src: html },
  css: { name: 'CSS', src: css },
  bootstrap: { name: 'Bootstrap', src: bootstrap },
  mysql: { name: 'MySQL', src: mysql, brighten: true },
  git: { name: 'Git', src: git },
  github: { name: 'GitHub', src: github, invert: true },
  aws: { name: 'AWS', src: aws, invert: true },
  flask: { name: 'Flask', src: flask, invert: true },
  pandas: { name: 'Pandas', src: pandas },
  numpy: { name: 'NumPy', src: numpy },
  scikitlearn: { name: 'Scikit-learn', src: scikitlearn },
  jupyter: { name: 'Jupyter', src: jupyter },
  vscode: { name: 'VS Code', src: vscode },
  plotly: { name: 'Plotly', src: plotly },
  bash: { name: 'Shell', src: bash, invert: true },
  copilot: { name: 'GitHub Copilot', src: si(siGithubcopilot), invert: true },
  claude: { name: 'Claude Code', src: si(siClaude) },
  n8n: { name: 'n8n', src: si(siN8n) },
  llm: { name: 'LLM', src: llm },
  blockchain: { name: 'Blockchain', src: blockchain },
  smartcontract: { name: 'Smart contracts', src: smartcontract },
}

export const TECH_KEYS = Object.keys(TECH)
