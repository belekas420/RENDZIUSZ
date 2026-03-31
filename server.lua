ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

-- --- SQL Initialization ---
MySQL.ready(function()
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS `player_stats` (
            `identifier` VARCHAR(60) NOT NULL,
            `kills` INT(11) DEFAULT 0,
            `deaths` INT(11) DEFAULT 0,
            PRIMARY KEY (`identifier`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ]])
end)

-- --- Player Stats Management ---
local playerStats = {}

-- Load stats when player joins
AddEventHandler('esx:playerLoaded', function(playerId, xPlayer)
    local identifier = xPlayer.getIdentifier()
    
    MySQL.Async.fetchAll('SELECT kills, deaths FROM player_stats WHERE identifier = @identifier', {
        ['@identifier'] = identifier
    }, function(result)
        if result[1] then
            playerStats[playerId] = {
                kills = result[1].kills,
                deaths = result[1].deaths
            }
        else
            -- Create initial entry
            MySQL.Async.execute('INSERT INTO player_stats (identifier, kills, deaths) VALUES (@identifier, 0, 0)', {
                ['@identifier'] = identifier
            })
            playerStats[playerId] = { kills = 0, deaths = 0 }
        end
        
        -- Send initial stats to client
        TriggerClientEvent('esx_ui:updateStats', playerId, playerStats[playerId])
    end)
end)

-- Cleanup when player leaves
AddEventHandler('esx:playerDropped', function(playerId)
    playerStats[playerId] = nil
end)

-- Event to request stats (e.g. when opening UI)
RegisterServerEvent('esx_ui:getStats')
AddEventHandler('esx_ui:getStats', function()
    local src = source
    if playerStats[src] then
        TriggerClientEvent('esx_ui:updateStats', src, playerStats[src])
    end
end)

-- Event to record a kill
RegisterServerEvent('esx_ui:onKill')
AddEventHandler('esx_ui:onKill', function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    
    if xPlayer and playerStats[src] then
        playerStats[src].kills = playerStats[src].kills + 1
        
        MySQL.Async.execute('UPDATE player_stats SET kills = @kills WHERE identifier = @identifier', {
            ['@kills'] = playerStats[src].kills,
            ['@identifier'] = xPlayer.getIdentifier()
        })
        
        TriggerClientEvent('esx_ui:updateStats', src, playerStats[src])
    end
end)

-- Event to record a death
RegisterServerEvent('esx_ui:onDeath')
AddEventHandler('esx_ui:onDeath', function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    
    if xPlayer and playerStats[src] then
        playerStats[src].deaths = playerStats[src].deaths + 1
        
        MySQL.Async.execute('UPDATE player_stats SET deaths = @deaths WHERE identifier = @identifier', {
            ['@deaths'] = playerStats[src].deaths,
            ['@identifier'] = xPlayer.getIdentifier()
        })
        
        TriggerClientEvent('esx_ui:updateStats', src, playerStats[src])
    end
end)

-- --- Admin List ---
local STAFF_LIST = {
    { identifier = 'license:1234567890abcdef', name = 'Vardas_Pavarde', role = 'Owner' },
}

RegisterServerEvent('esx_ui:getAdmins')
AddEventHandler('esx_ui:getAdmins', function()
    local src = source
    local onlineAdmins = {}
    local players = ESX.GetPlayers()

    for _, playerId in ipairs(players) do
        local xPlayer = ESX.GetPlayerFromId(playerId)
        for _, staff in ipairs(STAFF_LIST) do
            if xPlayer.getIdentifier() == staff.identifier then
                table.insert(onlineAdmins, {
                    name = staff.name,
                    role = staff.role,
                    status = 'Online'
                })
            end
        end
    end
    
    TriggerClientEvent('esx_ui:setAdmins', src, onlineAdmins)
end)

-- --- VIP Checks ---
ESX.RegisterServerCallback('ham-vip:checkvip', function(source, cb)
    -- Placeholder for VIP check
    cb(false)
end)

-- --- Actions ---
RegisterServerEvent('esx_ui:giveWeapon')
AddEventHandler('esx_ui:giveWeapon', function(weaponName)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer then
        xPlayer.addWeapon(weaponName, 250)
        xPlayer.showNotification("Weapon received: " .. weaponName)
    end
end)

RegisterServerEvent('esx_ui:spawnItem')
AddEventHandler('esx_ui:spawnItem', function(itemName)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer then
        xPlayer.addInventoryItem(itemName, 1)
        xPlayer.showNotification("Item received: " .. itemName)
    end
end)
