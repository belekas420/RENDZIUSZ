local display = false
local ESX = nil

Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
        Citizen.Wait(0)
    end
end)

function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    
    if bool then
        local playerPed = PlayerPedId()
        local playerId = GetPlayerServerId(PlayerId())
        local health = GetEntityHealth(playerPed) - 100
        local armor = GetPedArmour(playerPed)
        
        SendNUIMessage({
            type = "playerDataUpdate",
            playerData = {
                playerId = playerId,
                health = health > 0 and health or 0,
                armor = armor
            }
        })
    end

    SendNUIMessage({
        type = "ui",
        status = bool,
    })
end

-- --- Combat Tracking ---

AddEventHandler('baseevents:onPlayerKilled', function(killerId, deathData)
    TriggerServerEvent('esx_ui:onDeath')
end)

AddEventHandler('baseevents:onPlayerDied', function(deathData)
    TriggerServerEvent('esx_ui:onDeath')
end)

RegisterNetEvent('baseevents:onPlayerKilledOther')
AddEventHandler('baseevents:onPlayerKilledOther', function(targetId, deathData)
    TriggerServerEvent('esx_ui:onKill')
end)

RegisterNetEvent('esx_ui:updateStats')
AddEventHandler('esx_ui:updateStats', function(stats)
    SendNUIMessage({
        type = "playerDataUpdate",
        playerData = {
            kills = stats.kills,
            deaths = stats.deaths
        }
    })
end)

-- Periodic Data Sync
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000)
        if display then
            local playerPed = PlayerPedId()
            local health = GetEntityHealth(playerPed) - 100
            local armor = GetPedArmour(playerPed)
            
            SendNUIMessage({
                type = "playerDataUpdate",
                playerData = {
                    health = health > 0 and health or 0,
                    armor = armor
                }
            })
        end
    end
end)

-- --- Commands & Controls ---

RegisterCommand("menu", function()
    SetDisplay(not display)
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsControlJustReleased(1, 244) then -- M Key
            SetDisplay(not display)
        end
    end
end)

-- --- NUI Callbacks ---

RegisterNUICallback("exit", function(data)
    SetDisplay(false)
end)

RegisterNUICallback("main", function(data)
    if data.display then
        TriggerServerEvent('esx_ui:getAdmins')
        TriggerServerEvent('esx_ui:getStats')
        
        ESX.TriggerServerCallback('ham-vip:checkvip', function(isVIP)
            SendNUIMessage({
                type = "playerDataUpdate",
                playerData = {
                    isVIP = isVIP
                }
            })
        end)
    end
end)

RegisterNUICallback("triggerAction", function(data)
    local item = data.item
    local actionType = data.actionType
    local spawnCode = data.spawnCode
    
    if actionType == "spawnCar" then
        local playerPed = PlayerPedId()
        local coords = GetEntityCoords(playerPed)
        local heading = GetEntityHeading(playerPed)
        
        ESX.Game.SpawnVehicle(spawnCode, coords, heading, function(vehicle)
            TaskWarpPedIntoVehicle(playerPed, vehicle, -1)
            ESX.ShowNotification("Vehicle deployed: " .. item.name)
        end)
    elseif actionType == "teleport" then
        -- This would normally use a coordinates table, but for demo we just notify
        ESX.ShowNotification("Navigating to: " .. item.name)
    elseif actionType == "giveWeapon" then
        TriggerServerEvent('esx_ui:giveWeapon', spawnCode)
    elseif actionType == "spawnItem" then
        TriggerServerEvent('esx_ui:spawnItem', spawnCode)
    end
end)

-- --- Admin Updates ---

RegisterNetEvent('esx_ui:setAdmins')
AddEventHandler('esx_ui:setAdmins', function(admins)
    SendNUIMessage({
        type = "adminDataUpdate",
        admins = admins
    })
end)
