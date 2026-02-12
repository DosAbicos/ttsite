import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

const SizeChart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeData = {
    clothing: {
      headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)', 'Length (in)'],
      rows: [
        ['S', '34-36', '28-30', '34-36', '27'],
        ['M', '38-40', '32-34', '38-40', '28'],
        ['L', '42-44', '36-38', '42-44', '29'],
        ['XL', '46-48', '40-42', '46-48', '30'],
        ['XXL', '50-52', '44-46', '50-52', '31'],
      ]
    },
    pants: {
      headers: ['Size', 'Waist (in)', 'Hips (in)', 'Inseam (in)', 'Thigh (in)'],
      rows: [
        ['28', '28', '34', '30', '21'],
        ['30', '30', '36', '31', '22'],
        ['32', '32', '38', '32', '23'],
        ['34', '34', '40', '32', '24'],
        ['36', '36', '42', '33', '25'],
      ]
    }
  };

  const [activeTab, setActiveTab] = useState('clothing');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors underline"
        data-testid="size-chart-button"
      >
        <Ruler className="w-4 h-4" />
        Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-testid="size-chart-modal">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Size Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('clothing')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    activeTab === 'clothing' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Tops & Jackets
                </button>
                <button
                  onClick={() => setActiveTab('pants')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    activeTab === 'pants' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Pants & Denim
                </button>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {sizeData[activeTab].headers.map((header, idx) => (
                        <th key={idx} className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData[activeTab].rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-b hover:bg-gray-50">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={`px-4 py-3 ${cellIdx === 0 ? 'font-semibold' : ''}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to Measure */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">How to Measure</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest.</li>
                  <li><strong>Waist:</strong> Measure around the natural waistline.</li>
                  <li><strong>Hips:</strong> Measure around the fullest part of your hips.</li>
                  <li><strong>Inseam:</strong> Measure from crotch to ankle bone.</li>
                </ul>
              </div>

              {/* Tips */}
              <div className="mt-4 text-xs text-gray-500">
                <p>* All measurements are in inches.</p>
                <p>* For the best fit, we recommend sizing up if you're between sizes.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeChart;
