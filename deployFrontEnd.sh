#!/bin/bash

# Source and destination paths
source_path="./dist/ibe-registration/"  # Current directory

# Prompt for the project name
read -p "Enter the project name: " project_name

# Check if the project name is provided
if [ -z "$project_name" ]; then
    echo "Project name is required."
    exit 1
fi

# Construct the destination path
destination_path="rob@18.170.248.104:/home/apps/$project_name/"

# Run rsync over SSH
rsync -avz --update --exclude "*.sh" --exclude "*.md" -e "ssh" "$source_path" "$destination_path"

# Check rsync exit status
if [ $? -eq 0 ]; then
    echo "Successfully synchronized."
else
    echo "Synchronization encountered errors."
fi
