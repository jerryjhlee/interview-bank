import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('date_asked', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { question, company, job_title, date_asked } = req.body

    if (!question || !company || !job_title || !date_asked) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([{ question, company, job_title, date_asked }])
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
