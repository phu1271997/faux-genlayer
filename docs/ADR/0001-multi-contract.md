# ADR 0001: Multi-Contract Architecture

## Context
A monolithic contract mixing case logic, funds escrow, and reputation tracking increases code surface risk and makes upgrades complex.

## Decision
Split system into three core contracts: `FauxCore`, `FauxTreasury`, and `FauxReputation`.

## Status
Accepted.
