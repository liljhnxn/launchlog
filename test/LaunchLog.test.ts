import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { LaunchLog } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LaunchLog Smart Contract", function () {
  let launchLog: LaunchLog;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const LaunchLogFactory = await ethers.getContractFactory("LaunchLog");
    launchLog = await LaunchLogFactory.deploy();
    await launchLog.waitForDeployment();
  });

  describe("Publishing Projects", function () {
    it("Should create a project with valid inputs and emit ProjectCreated", async function () {
      const tx = await launchLog.connect(addr1).createProject(
        "DeFi Swap",
        "A fast decentralized exchange protocol",
        "https://defiswap.xyz"
      );

      await expect(tx)
        .to.emit(launchLog, "ProjectCreated")
        .withArgs(1, addr1.address, "DeFi Swap", "https://defiswap.xyz", (val: bigint) => val > 0n);

      const project = await launchLog.getProject(1);
      expect(project.id).to.equal(1n);
      expect(project.name).to.equal("DeFi Swap");
      expect(project.description).to.equal("A fast decentralized exchange protocol");
      expect(project.website).to.equal("https://defiswap.xyz");
      expect(project.creator).to.equal(addr1.address);
      expect(project.isActive).to.equal(true);
    });

    it("Should reject empty project name", async function () {
      await expect(
        launchLog.connect(addr1).createProject("", "Description here", "https://example.com")
      ).to.be.revertedWithCustomError(launchLog, "EmptyField").withArgs("name");
    });

    it("Should reject empty project description", async function () {
      await expect(
        launchLog.connect(addr1).createProject("Project Name", "", "https://example.com")
      ).to.be.revertedWithCustomError(launchLog, "EmptyField").withArgs("description");
    });

    it("Should reject empty website", async function () {
      await expect(
        launchLog.connect(addr1).createProject("Project Name", "Description here", "")
      ).to.be.revertedWithCustomError(launchLog, "EmptyField").withArgs("website");
    });

    it("Should reject names longer than 50 characters", async function () {
      const longName = "a".repeat(51);
      await expect(
        launchLog.connect(addr1).createProject(longName, "Description here", "https://example.com")
      ).to.be.revertedWithCustomError(launchLog, "ExceedsMaxLength").withArgs("name", 50);
    });

    it("Should reject descriptions longer than 200 characters", async function () {
      const longDesc = "a".repeat(201);
      await expect(
        launchLog.connect(addr1).createProject("Project Name", longDesc, "https://example.com")
      ).to.be.revertedWithCustomError(launchLog, "ExceedsMaxLength").withArgs("description", 200);
    });

    it("Should reject website URLs longer than 200 characters", async function () {
      const longUrl = "https://example.com/" + "a".repeat(190);
      await expect(
        launchLog.connect(addr1).createProject("Project Name", "Description here", longUrl)
      ).to.be.revertedWithCustomError(launchLog, "ExceedsMaxLength").withArgs("website", 200);
    });
  });

  describe("Updating Projects", function () {
    beforeEach(async function () {
      await launchLog.connect(addr1).createProject(
        "Initial Project",
        "Initial description",
        "https://init.example.com"
      );
    });

    it("Should allow the creator to update their project", async function () {
      const tx = await launchLog.connect(addr1).updateProject(
        1,
        "Updated Project",
        "Updated description text",
        "https://updated.example.com"
      );

      await expect(tx)
        .to.emit(launchLog, "ProjectUpdated")
        .withArgs(1, addr1.address, "Updated Project", "https://updated.example.com", (val: bigint) => val > 0n);

      const project = await launchLog.getProject(1);
      expect(project.name).to.equal("Updated Project");
      expect(project.description).to.equal("Updated description text");
      expect(project.website).to.equal("https://updated.example.com");
    });

    it("Should prevent non-creators from updating", async function () {
      await expect(
        launchLog.connect(addr2).updateProject(
          1,
          "Hacked Project",
          "Hacked description",
          "https://evil.com"
        )
      ).to.be.revertedWithCustomError(launchLog, "NotCreator").withArgs(1, addr2.address);
    });

    it("Should reject update if fields are invalid or exceed limits", async function () {
      await expect(
        launchLog.connect(addr1).updateProject(1, "", "valid description", "https://example.com")
      ).to.be.revertedWithCustomError(launchLog, "EmptyField").withArgs("name");
    });
  });

  describe("Deleting Projects", function () {
    beforeEach(async function () {
      await launchLog.connect(addr1).createProject(
        "Project To Delete",
        "Will be removed soon",
        "https://todelete.example.com"
      );
    });

    it("Should allow the creator to delete their project", async function () {
      const tx = await launchLog.connect(addr1).deleteProject(1);
      await expect(tx)
        .to.emit(launchLog, "ProjectDeleted")
        .withArgs(1, addr1.address, (val: bigint) => val > 0n);

      await expect(launchLog.getProject(1))
        .to.be.revertedWithCustomError(launchLog, "ProjectNotFound")
        .withArgs(1);
    });

    it("Should prevent non-creators from deleting a project", async function () {
      await expect(
        launchLog.connect(addr2).deleteProject(1)
      ).to.be.revertedWithCustomError(launchLog, "NotCreator").withArgs(1, addr2.address);
    });

    it("Should not allow deleting an already deleted project", async function () {
      await launchLog.connect(addr1).deleteProject(1);
      await expect(
        launchLog.connect(addr1).deleteProject(1)
      ).to.be.revertedWithCustomError(launchLog, "ProjectNotFound").withArgs(1);
    });
  });

  describe("Retrieving Projects", function () {
    it("Should return all active projects across creators and filter deleted ones", async function () {
      await launchLog.connect(addr1).createProject("Project 1", "Desc 1", "https://p1.com");
      await launchLog.connect(addr2).createProject("Project 2", "Desc 2", "https://p2.com");
      await launchLog.connect(addr1).createProject("Project 3", "Desc 3", "https://p3.com");

      let all = await launchLog.getAllProjects();
      expect(all.length).to.equal(3);
      expect(all[0].name).to.equal("Project 1");
      expect(all[1].name).to.equal("Project 2");
      expect(all[2].name).to.equal("Project 3");

      // Delete project 2
      await launchLog.connect(addr2).deleteProject(2);

      all = await launchLog.getAllProjects();
      expect(all.length).to.equal(2);
      expect(all[0].name).to.equal("Project 1");
      expect(all[1].name).to.equal("Project 3");
    });

    it("Should return only caller's active projects in getMyProjects", async function () {
      await launchLog.connect(addr1).createProject("Addr1 P1", "Desc", "https://p1.com");
      await launchLog.connect(addr2).createProject("Addr2 P1", "Desc", "https://p2.com");
      await launchLog.connect(addr1).createProject("Addr1 P2", "Desc", "https://p3.com");

      const myProjectsAddr1 = await launchLog.connect(addr1).getMyProjects();
      expect(myProjectsAddr1.length).to.equal(2);
      expect(myProjectsAddr1[0].name).to.equal("Addr1 P1");
      expect(myProjectsAddr1[1].name).to.equal("Addr1 P2");

      const myProjectsAddr2 = await launchLog.connect(addr2).getMyProjects();
      expect(myProjectsAddr2.length).to.equal(1);
      expect(myProjectsAddr2[0].name).to.equal("Addr2 P1");

      // Delete one of Addr1's projects
      await launchLog.connect(addr1).deleteProject(1);
      const myProjectsAddr1After = await launchLog.connect(addr1).getMyProjects();
      expect(myProjectsAddr1After.length).to.equal(1);
      expect(myProjectsAddr1After[0].name).to.equal("Addr1 P2");
    });
  });
});
