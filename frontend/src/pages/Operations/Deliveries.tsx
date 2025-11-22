import React, { useState, useEffect } from 'react';
import { TruckIcon, Plus, Loader2, Check, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Delivery {
  _id: string;
  deliveryNumber: string;
  customer: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  items: Array<{
    product: { _id: string; name: string; sku: string; currentStock: number };
    requestedQty: number;
    pickedQty: number;
  }>;
}

export const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    deliveryAddress: '',
    deliveryDate: '',
    items: [] as Array<{ product: string; requestedQty: number; pickedQty: number }>,
  });
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchDeliveries();
    fetchProducts();
  }, [selectedStatus]);

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const params = selectedStatus ? `?status=${selectedStatus}` : '';
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/deliveries${params}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setDeliveries(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load deliveries');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`,
        { headers: { Authorization: `Bearer ${token}` } });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', requestedQty: 0, pickedQty: 0 }],
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.deliveryAddress || !formData.deliveryDate || formData.items.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/deliveries`, formData,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Delivery created successfully');
      setShowModal(false);
      setFormData({ customer: '', deliveryAddress: '', deliveryDate: '', items: [] });
      fetchDeliveries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create delivery');
    }
  };

  const handleValidate = async (id: string) => {
    if (!window.confirm('Validate this delivery and deduct stock?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/deliveries/${id}/validate`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Delivery validated and stock updated');
      fetchDeliveries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to validate delivery');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this delivery?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/deliveries/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Delivery deleted');
      fetchDeliveries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete delivery');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      Picking: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
      Packed: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
      Shipped: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
      Delivered: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400',
    };
    return colors[status] || colors.Draft;
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Delivery Orders (Outgoing)</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Process outgoing deliveries to customers</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Delivery
          </button>
        </div>
        <div className="flex gap-2">
          {['', 'Draft', 'Picking', 'Packed', 'Shipped', 'Delivered'].map((status) => (
            <button key={status} onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedStatus === status ? 'bg-primary-600 text-white' :
                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
              {status || 'All'}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <TruckIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No deliveries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Delivery #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Items</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {deliveries.map((delivery) => (
                  <tr key={delivery._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{delivery.deliveryNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{delivery.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{delivery.items.length}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {delivery.status === 'Packed' && (
                          <button onClick={() => handleValidate(delivery._id)}
                            className="p-2 text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 rounded-lg">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {delivery.status !== 'Delivered' && (
                          <button onClick={() => handleDelete(delivery._id)}
                            className="p-2 text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-xl border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Delivery</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer *</label>
                    <input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                    <input type="text" value={formData.deliveryAddress} onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Date *</label>
                    <input type="date" value={formData.deliveryDate} onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Items *</label>
                      <button type="button" onClick={handleAddItem} className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                    </div>
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <select value={item.product} onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border rounded-lg text-sm">
                          <option value="">Select product</option>
                          {products.map((p) => <option key={p._id} value={p._id}>{p.name} (Stock: {p.currentStock})</option>)}
                        </select>
                        <input type="number" placeholder="Requested" value={item.requestedQty}
                          onChange={(e) => handleItemChange(idx, 'requestedQty', parseInt(e.target.value) || 0)}
                          className="w-28 px-3 py-2 bg-white dark:bg-gray-700 border rounded-lg text-sm" />
                        <input type="number" placeholder="Picked" value={item.pickedQty}
                          onChange={(e) => handleItemChange(idx, 'pickedQty', parseInt(e.target.value) || 0)}
                          className="w-28 px-3 py-2 bg-white dark:bg-gray-700 border rounded-lg text-sm" />
                        <button type="button" onClick={() => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) })}
                          className="p-2 text-error-600 hover:bg-error-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Create Delivery</button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
