// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LaunchLog
 * @notice Decentralized project showcase where creators publish and manage their projects.
 * @dev "Every launch deserves a record."
 */
contract LaunchLog {
    struct Project {
        uint256 id;
        string name;
        string description;
        string website;
        address creator;
        uint256 createdAt;
        bool isActive;
    }

    uint256 private _nextProjectId = 1;

    // Mapping from project ID to Project
    mapping(uint256 => Project) public projects;
    // Array to track all project IDs
    uint256[] private _projectIds;

    // Events
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        string name,
        string website,
        uint256 createdAt
    );

    event ProjectUpdated(
        uint256 indexed projectId,
        address indexed creator,
        string name,
        string website,
        uint256 updatedAt
    );

    event ProjectDeleted(
        uint256 indexed projectId,
        address indexed creator,
        uint256 timestamp
    );

    // Custom errors for gas efficiency and clear messaging
    error EmptyField(string field);
    error ExceedsMaxLength(string field, uint256 max);
    error ProjectNotFound(uint256 projectId);
    error NotCreator(uint256 projectId, address caller);

    /**
     * @notice Publish a new project to LaunchLog
     * @param name Project name (1-50 characters)
     * @param description Short project summary (1-200 characters)
     * @param website Project website URL (1-200 characters)
     */
    function createProject(
        string calldata name,
        string calldata description,
        string calldata website
    ) external returns (uint256) {
        _validateInputs(name, description, website);

        uint256 projectId = _nextProjectId++;

        projects[projectId] = Project({
            id: projectId,
            name: name,
            description: description,
            website: website,
            creator: msg.sender,
            createdAt: block.timestamp,
            isActive: true
        });

        _projectIds.push(projectId);

        emit ProjectCreated(projectId, msg.sender, name, website, block.timestamp);

        return projectId;
    }

    /**
     * @notice Update an existing project owned by the caller
     * @param projectId ID of the project to update
     * @param name New project name (1-50 characters)
     * @param description New short description (1-200 characters)
     * @param website New website URL (1-200 characters)
     */
    function updateProject(
        uint256 projectId,
        string calldata name,
        string calldata description,
        string calldata website
    ) external {
        Project storage project = projects[projectId];

        if (!project.isActive) {
            revert ProjectNotFound(projectId);
        }
        if (project.creator != msg.sender) {
            revert NotCreator(projectId, msg.sender);
        }

        _validateInputs(name, description, website);

        project.name = name;
        project.description = description;
        project.website = website;

        emit ProjectUpdated(projectId, msg.sender, name, website, block.timestamp);
    }

    /**
     * @notice Delete an existing project owned by the caller
     * @param projectId ID of the project to delete
     */
    function deleteProject(uint256 projectId) external {
        Project storage project = projects[projectId];

        if (!project.isActive) {
            revert ProjectNotFound(projectId);
        }
        if (project.creator != msg.sender) {
            revert NotCreator(projectId, msg.sender);
        }

        project.isActive = false;

        emit ProjectDeleted(projectId, msg.sender, block.timestamp);
    }

    /**
     * @notice Retrieve all active published projects
     */
    function getAllProjects() external view returns (Project[] memory) {
        uint256 total = _projectIds.length;
        uint256 activeCount = 0;

        for (uint256 i = 0; i < total; i++) {
            if (projects[_projectIds[i]].isActive) {
                activeCount++;
            }
        }

        Project[] memory activeList = new Project[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 pid = _projectIds[i];
            if (projects[pid].isActive) {
                activeList[currentIndex] = projects[pid];
                currentIndex++;
            }
        }

        return activeList;
    }

    /**
     * @notice Retrieve all active projects published by the caller
     */
    function getMyProjects() external view returns (Project[] memory) {
        uint256 total = _projectIds.length;
        uint256 myCount = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 pid = _projectIds[i];
            if (projects[pid].isActive && projects[pid].creator == msg.sender) {
                myCount++;
            }
        }

        Project[] memory myList = new Project[](myCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 pid = _projectIds[i];
            if (projects[pid].isActive && projects[pid].creator == msg.sender) {
                myList[currentIndex] = projects[pid];
                currentIndex++;
            }
        }

        return myList;
    }

    /**
     * @notice Retrieve single project by ID
     */
    function getProject(uint256 projectId) external view returns (Project memory) {
        Project memory project = projects[projectId];
        if (!project.isActive) {
            revert ProjectNotFound(projectId);
        }
        return project;
    }

    /**
     * @dev Internal helper to validate input strings
     */
    function _validateInputs(
        string calldata name,
        string calldata description,
        string calldata website
    ) internal pure {
        if (bytes(name).length == 0) revert EmptyField("name");
        if (bytes(name).length > 50) revert ExceedsMaxLength("name", 50);

        if (bytes(description).length == 0) revert EmptyField("description");
        if (bytes(description).length > 200) revert ExceedsMaxLength("description", 200);

        if (bytes(website).length == 0) revert EmptyField("website");
        if (bytes(website).length > 200) revert ExceedsMaxLength("website", 200);
    }
}

