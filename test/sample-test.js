const { ethers } = require("hardhat");
const { expect } = require("chai");

const testTreasury = "0x5061A60D2893fbbC5a06c88B9b0EF8a423442a55";
const zero = '0x0000000000000000000000000000000000000000';

describe("TestCoin tests", function() {

  let TC;
  let tc;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    TC = await ethers.getContractFactory("TestCoin");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    // Deploy with treasury address
    tc = await TC.deploy(testTreasury);
    // Mint, because we need some coins to play with!
    await tc.mint(addr1.address, 1000);
    await tc.mint(addr2.address, 1000);
    await tc.mint(owner.address, 1000);
  });


  it("Sanity check - Should display decimal places for TestCoin", async function() {

    // Check decimals
    await tc.decimals();
    expect(await tc.decimals()).to.equal(18);
  });

  it("Mint and check", async function() {

    // Check total supply
    const total = await tc.totalSupply();
    expect(total).to.equal(3000);
    console.log('total = ', total.toString());
  });

  it("Transfer and check", async function() {

    // Check total supply
    const ownerBal = await tc.balanceOf(owner.address);
    let addr2Bal = await tc.balanceOf(addr2.address);
    await tc.transfer(addr2.address, 100);
    console.log('ownerBalance = ', await tc.totalSupply());
    expect(await tc.balanceOf(owner.address)).to.equal(900);
    expect(await tc.balanceOf(addr2.address)).to.equal(1090)
    expect(await tc.balanceOf(testTreasury)).to.equal(5) // 25 should belong to the treasury
    expect(await tc.totalSupply()).to.equal(2995) // 25 should have been burned
  });

  it("Transfer and check", async function() {

    // Check total supply
    const ownerBal = await tc.balanceOf(owner.address);
    let addr2Bal = await tc.balanceOf(addr2.address);
    await tc.transfer(addr2.address, 350);
    // slightly off from exact due to rounding of other numbers
    expect(await tc.balanceOf(owner.address)).to.equal(651);
    expect(await tc.balanceOf(addr2.address)).to.equal(1315)
    expect(await tc.balanceOf(testTreasury)).to.equal(17) // 25 should belong to the treasury
    expect(await tc.totalSupply()).to.equal(2983) // 25 should have been burned
  });

  it("Transfer and check", async function() {

    // Check total supply
    const ownerBal = await tc.balanceOf(owner.address);
    let addr2Bal = await tc.balanceOf(addr2.address);
    await tc.transfer(addr2.address, 172);
    // slightly off from exact due to rounding of other numbers
    expect(await tc.balanceOf(owner.address)).to.equal(830);
    expect(await tc.balanceOf(addr2.address)).to.equal(1154)
    expect(await tc.balanceOf(testTreasury)).to.equal(8) // 25 should belong to the treasury
    expect(await tc.totalSupply()).to.equal(2992) // 25 should have been burned
  });

  it("Blacklist addr1 - SHOULD FAIL", async function() {

    await tc.toggleBlacklist(addr1.address);
    // transfer to blacklisted address should fail
    await tc.transfer(addr1.address, 200);
  });

  it("Blacklist addr1", async function() {

    await tc.toggleBlacklist(addr1.address);
    await tc.toggleBlacklist(addr1.address);
    // transfer to blacklisted address should pass since blacklist was toggled twice
    await tc.transfer(addr1.address, 200);

    expect(await tc.balanceOf(addr1.address)).to.equal(1180)
  });
});