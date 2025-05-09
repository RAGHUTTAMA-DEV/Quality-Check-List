import { useAuth } from '@/hooks/AuthContext'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Layout from '@/components/ui/Layout'
import axios from 'axios'

export default function Tracker() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  async function CreateCall() {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3000/api/logs/create', 
      {
        message,
        action,
        name,
        stage
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      alert("Log created successfully!");
      // Clear form fields after successful creation
      setMessage('');
      setAction('');
      setName('');
      setStage('');
      // Refresh logs after creating a new one
      GetAllLogs();
    } catch (err) {
      console.error(err);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function GetAllLogs() {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/logs/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setLogs(response.data.logs);
      setActiveTab('all');
    } catch (err) {
      console.error(err);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function getLogsByName() {
    try {
      if (!searchName.trim()) {
        setFilteredLogs([]);
        return;
      }
      
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/logs/${searchName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setFilteredLogs(response.data.logs);
      setActiveTab('search');
    } catch (err) {
      console.error(err);
      setIsErr(true);
      setFilteredLogs([]);
    } finally {
      setIsLoading(false);
    }
  }

  const renderTimeline = (logsToRender) => {
    if (!logsToRender || logsToRender.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No activity logs found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {logsToRender.map((log, index) => (
          <div key={log._id || index} className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground border-4 border-primary">
                <span className="text-xs font-bold">{log.action ? log.action.charAt(0).toUpperCase() : 'L'}</span>
              </div>
              <div className="h-full w-0.5 bg-border"></div>
            </div>
            <div className="flex flex-col pb-8">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{log.name}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  {log.action}
                </span>
                {log.stage && (
                  <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs">
                    {log.stage}
                  </span>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">{log.message}</p>
              <time className="mt-2 text-xs text-muted-foreground">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
              </time>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout title="Activity Tracker">
      <div className="mb-6">
        <p className="text-muted-foreground">Track and manage system activity logs</p>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'create' ? "default" : "outline"}
          onClick={() => setActiveTab('create')}
        >
          Create Log
        </Button>
        <Button 
          variant={activeTab === 'all' ? "default" : "outline"}
          onClick={GetAllLogs}
        >
          View All Logs
        </Button>
        <Button 
          variant={activeTab === 'search' ? "default" : "outline"}
          onClick={() => setActiveTab('search')}
        >
          Search Logs
        </Button>
      </div>

      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input 
                  value={name}
                  placeholder="Enter name" 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Action</label>
                <Input 
                  value={action}
                  placeholder="Enter action" 
                  onChange={(e) => setAction(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Input 
                  value={message}
                  placeholder="Enter message" 
                  onChange={(e) => setMessage(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Stage (Optional)</label>
                <Input 
                  value={stage}
                  placeholder="Enter stage" 
                  onChange={(e) => setStage(e.target.value)} 
                />
              </div>
              <Button 
                className="w-full" 
                onClick={CreateCall}
                disabled={!name || !action || !message || isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Log Entry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle>Search Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder='Enter name to search' 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)} 
              />
              <Button 
                onClick={getLogsByName}
                disabled={!searchName.trim() || isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">Searching logs...</div>
            ) : (
              <>
                <CardTitle className="text-lg mb-4">Search Results</CardTitle>
                {renderTimeline(filteredLogs)}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading logs...</div>
            ) : (
              renderTimeline(logs)
            )}
          </CardContent>
        </Card>
      )}

      {isErr && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
          An error occurred while processing your request. Please try again.
        </div>
      )}
    </Layout>
  );
}